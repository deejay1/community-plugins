/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Progress } from '@backstage/core-components';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { techRadarApiRef } from '../api';
import {
  RadarEntry,
  TechRadarLoaderResponse,
} from '@backstage-community/plugin-tech-radar-common';
import Radar from '../components/Radar';
import type { Entry } from '../utils/types';

const useTechRadarLoader = (id: string | undefined) => {
  const errorApi = useApi(errorApiRef);
  const techRadarApi = useApi(techRadarApiRef);

  const { error, value, loading } = useAsync(
    async () => techRadarApi.load(id),
    [techRadarApi, id],
  );

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  return { loading, value, error };
};

function matchFilter(filter?: string): (entry: RadarEntry) => boolean {
  const terms = filter
    ?.toLocaleLowerCase('en-US')
    .split(/\s/)
    .map(e => e.trim())
    .filter(Boolean);

  if (!terms?.length) {
    return () => true;
  }

  return entry => {
    const text = `${entry.title} ${
      entry.timeline[0]?.description || ''
    }`.toLocaleLowerCase('en-US');
    return terms.every(term => text.includes(term));
  };
}

function calculateDimensions(width: number, height: number) {
  return {
    width: width * 0.85,
    height: height * 0.7,
  };
}

/**
 * Properties of {@link TechRadarComponent}
 *
 * @public
 */
export interface TechRadarComponentProps {
  /**
   * ID of this Tech Radar
   *
   * @remarks
   *
   * Used when there are multiple Tech Radars and passed to {@link TechRadarApi.load}
   */
  id?: string;
  /**
   * Width of Tech Radar. Dynamically calculated if not supplied
   */
  width?: number;
  /**
   * Height of Tech Radar. Dynamically calculated if not supplied
   */
  height?: number;
  /**
   * Custom React props to the `<svg>` element created for Tech Radar
   */
  svgProps?: object;
  /**
   * Text to filter RadarEntry inside Tech Radar
   */
  searchText?: string;
}

/**
 * Main React component of Tech Radar
 *
 * @remarks
 *
 * For advanced use cases. Typically, you want to use {@link TechRadarPage}
 *
 * @public
 */
export function RadarComponent(props: TechRadarComponentProps) {
  const { loading, error, value: data } = useTechRadarLoader(props.id);
  const [dimensions, setDimensions] = useState(
    calculateDimensions(window.innerWidth, window.innerHeight),
  );

  useEffect(() => {
    const handleResize = () => {
      setDimensions(calculateDimensions(window.innerWidth, window.innerHeight));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mapToEntries = (
    loaderResponse: TechRadarLoaderResponse,
  ): Array<Entry> => {
    return loaderResponse.entries
      .filter(matchFilter(props.searchText))
      .map(entry => ({
        id: entry.key,
        quadrant: loaderResponse.quadrants.find(q => q.id === entry.quadrant)!,
        title: entry.title,
        ring: loaderResponse.rings.find(
          r => r.id === entry.timeline[0].ringId,
        )!,
        timeline: entry.timeline.map(e => {
          return {
            date: e.date,
            ring: loaderResponse.rings.find(a => a.id === e.ringId)!,
            description: e.description,
            moved: e.moved,
          };
        }),
        moved: entry.timeline[0].moved,
        description: entry.description || entry.timeline[0].description,
        url: entry.url,
        links: entry.links,
      }));
  };

  return (
    <>
      {loading && <Progress />}
      {!loading && !error && data && (
        <Radar
          {...props}
          width={props.width || dimensions.width}
          height={props.height || dimensions.height}
          rings={data.rings}
          quadrants={data.quadrants}
          entries={mapToEntries(data)}
        />
      )}
    </>
  );
}
