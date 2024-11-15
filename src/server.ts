import cors from "cors";
import { Server } from "http";
import app from "./app";
app.use(cors());

const port = 3000;

async function main() {
    const server: Server = app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    })
}

main();
