## API Report File for "@backstage-community/plugin-copilot"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
/// <reference types="react" />

import { BackstagePlugin } from '@backstage/core-plugin-api';
import { JSX as JSX_2 } from 'react';
import { JSX as JSX_3 } from 'react/jsx-runtime';
import { RouteRef } from '@backstage/core-plugin-api';
import { SubRouteRef } from '@backstage/core-plugin-api';

// @public
export const CopilotIndexPage: () => JSX_3.Element;

// @public
export const copilotPlugin: BackstagePlugin<
  {
    copilot: RouteRef<undefined>;
    enterprise: SubRouteRef<undefined>;
    organization: SubRouteRef<undefined>;
  },
  {},
  {}
>;

// @public
export const CopilotSidebar: () => JSX_2.Element;
```
