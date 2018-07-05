const fs = require('fs');
const util = require('util');

fsreaddir = util.promisify(fs.readdir);
module.exports = {
  parseFile: async (filename) => {
    const file = await fs.readFileSync(`./public/${filename}`, 'utf-8');
    return file;
  },

  parseDir: async () => {
    const filenames = await fsreaddir('./public', null);
    return {files: filenames};
  },
  
  writeFile: async (filename, body) => {
    const returnVal = await fs.writeFile(`./public/${filename}`, body)
    return returnVal;
  }
}
