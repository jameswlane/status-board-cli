import * as fs from 'fs';
import * as path from 'path';

export function directoryHasStatusBoardProject(dir: string) {
  // The project should have these items
  const requiredItems = ['packages', 'package.json', 'config'];
  return requiredItems.every((item) => {
    return fs.existsSync(path.join(dir, item));
  });
}
