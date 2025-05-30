/*
 * Copyright 2021 The Backstage Authors
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
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { ilertApiRef } from '../../api';
import { StatusPage } from '../../types';

import { Link } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

export const StatusPageActionsMenu = ({
  statusPage,
}: {
  statusPage: StatusPage;
}) => {
  const ilertApi = useApi(ilertApiRef);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`statusPage-actions-menu-${statusPage.id}`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          style: { maxHeight: 48 * 5.5 },
        }}
      >
        <MenuItem key="details" onClick={handleCloseMenu}>
          <Typography variant="inherit" noWrap>
            <Link to={ilertApi.getStatusPageDetailsURL(statusPage)}>
              View in iLert
            </Link>
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="inherit" noWrap>
            <Link to={`https://${ilertApi.getStatusPageURL(statusPage)}`}>
              View status page
            </Link>
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
