const socket = require("socket.io");

const initializeSocketServer = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, chatId }) => {
      // uniqueChatId
      const room = [userId, chatId].sort().join("_");
      socket.join(room);
    });

    socket.on("sendMessage", ({userId, chatId, text}) => {
        const room = [userId, chatId].sort().join("_");
        io.to(room).emit("messageReceived", { userId, text });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocketServer;


// export class FileUtils {
//   public static writeZippedBuffer(file_path: string, content: Obbject): Object{
//     const zip = new AdmZip(content);
//     const zipEntries = zip.getEntries();
//     let all_file_paths = [];
//     for(const zipEntry of zipEntries) {
//       let entryName = zipEntry.entryName;
//       let filepath = FileUtils.createPathFromFilepathAndName(file_path, entryName);
//       const parentDir = Path2D.dirName(filepath);
//       if(!FileSystem.existsSync(parentDir)){
//         fs.mkdirSync(parentDir, { recursive: true });
//       }
//       all_file_paths.push(filepath);
//       fs.writeFileSync(filepath, zipEntry.getData().toString('utf8'));
//     }
//     return all_file_paths;
//   }

//   public static createPathFromFilepathAndName(file_path, file_name): string{
//     return path.join(file_path, file_name);
//   }
// }
