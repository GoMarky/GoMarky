import { IServicesAccessor } from '@/platform/instantiation/common/instantiation';
import { IStoreService } from '@/platform/store/common/storeService';
import { IMiddlewareContext } from '@/platform/router/common/middleware';

import { WorkspaceModule } from '@/platform/store/electron-browser/workspace';

/**
 * @author Teodor_Dre <swen295@gmail.com>
 *
 * @description
 *  Redirect user if he go to route that doesn't need authentication.
 *
 *  For example:
 *  If user already logged in and he enter to /login/ page, we need to redirect him to main page.
 *
 * @param {IServicesAccessor} accessor - accessing to another services
 * @param {IMiddlewareContext} context - middleware context
 *
 * @returns Promise<void>
 */
export function registerWorkspaceModule(
  accessor: IServicesAccessor,
  context: IMiddlewareContext
): Promise<void> {
  const storeService = accessor.get(IStoreService);

  storeService.registerModule('workspace', WorkspaceModule);

  return context.next();
}
