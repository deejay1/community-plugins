/*
 * Copyright 2025 The Backstage Authors
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
import { Alert, AlertTitle } from '@material-ui/lab';

const PermissionAlert = () => {
  return (
    <Alert severity="warning" data-testid="no-permission-alert">
      <AlertTitle>Permission required</AlertTitle>
      To view security information, contact your administrator to give you the
      mssv.view.read permission.
    </Alert>
  );
};
export default PermissionAlert;
