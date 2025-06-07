// getWorkspacePageMetaByIdQuery import removed
import { Store } from '@toeverything/infra';

import { type CloudDocMetaType } from '../entities/cloud-doc-meta';
import type { WorkspaceServerService } from '../services/workspace-server';

export class CloudDocMetaStore extends Store {
  constructor(private readonly workspaceServerService: WorkspaceServerService) {
    super();
  }

  async fetchCloudDocMeta(
    workspaceId: string,
    docId: string,
    abortSignal?: AbortSignal
  ): Promise<CloudDocMetaType> {
    if (!this.workspaceServerService.server) {
      throw new Error('Server not found');
    }
    if (!this.workspaceServerService.server.baseUrl) {
      throw new Error('Server base URL is not configured');
    }
    // Construct the full URL
    const fullUrl = `${this.workspaceServerService.server.baseUrl}/v1/workspaces/${workspaceId}/docs/${docId}/meta`;

    const res = await this.workspaceServerService.server.fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortSignal,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Failed to fetch cloud doc meta:', errorText);
      throw new Error(`Failed to fetch cloud doc meta: ${res.statusText} - ${errorText}`);
    }

    const responseData = await res.json();
    // Proposed REST API returns { data: CloudDocMetaType }
    // The GQL version returned serverConfigData.workspace.pageMeta (which is CloudDocMetaType)
    if (!responseData.data) {
        throw new Error('Cloud doc meta data is not in the expected format from API response');
    }
    return responseData.data;
  }
}
