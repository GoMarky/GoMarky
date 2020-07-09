import {
  IInstantiationService,
  IServicesAccessor,
} from '@/platform/instantiation/common/instantiation';

import { IFileService, IFileStatWithMetadata } from '@/platform/files/common/files';
import { basename, joinPath, URI } from '@/base/common/uri';
import { IWindowService } from '@/platform/windows/common/windows';

import product from '@/platform/product/node';
import { isLinux } from '@/base/platform';
import { INotificationService } from '@/platform/notification/common/notification';
import { IWorkspaceContextService } from '@/platform/workspace/common/workspace';

export function dragFilesHandler(
  event: DragEvent,
  instantiationService: IInstantiationService
): Promise<void> {
  return instantiationService.invokeFunction(async (accessor: IServicesAccessor) => {
    const fileService = accessor.get(IFileService);
    const windowsService = accessor.get(IWindowService);
    const notificationService = accessor.get(INotificationService);
    const workspaceService = accessor.get(IWorkspaceContextService);

    const workspace = workspaceService.workspace;

    event.preventDefault();
    event.stopPropagation();

    const data = event.dataTransfer;

    if (!data) {
      return;
    }

    const images = Array.from(data.files).map((file: File) => ({
      name: file.name,
      path: file.path,
    }));

    const selectedDocument = workspace.selectedDocument;

    const detail = 'Copy or move your files in dataset folder?';

    const move = 'Move';
    const copy = 'Copy';
    let buttons: string[];

    if (isLinux) {
      buttons = [copy, move];
    } else {
      buttons = [move, copy];
    }

    const result = await windowsService.showMessageBox({
      title: product.nameLong,
      type: 'info',
      message: product.nameLong,
      detail: `\n${detail}`,
      buttons,
      noLink: true,
    });

    let method: (source: URI, target: URI, overwrite?: boolean) => Promise<IFileStatWithMetadata>;

    if (result.response === 1) {
      method = fileService.copy;
    } else {
      method = fileService.move;
    }

    for (const image of images) {
      const resource = URI.file(image.path);
      const targetResource = joinPath(selectedDocument.resource, 'media', basename(resource));

      try {
        await method.call(fileService, resource, targetResource, false);
      } catch (error) {
        notificationService.error(error.message);
      }
    }
  });
}
