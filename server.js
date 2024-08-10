import { readFileSync } from "fs";
import exportss from "express";
import { join } from "path";
import { createServer as createViteServer } from "vite";

async function dataServer() {
    const POST = 3000;

    const app = exportss();

    // 获取vite中间键并注册到app下
    // 如果用vite自己的html逻辑就可以使用html
    const vite = await createViteServer({
        server: {
            middlewareMode: "ssr"
        },
    });

    app.use(vite.middlewares);

    app.use("*", async (req, res) => {
        // 触发请求执行

        // 读取index.html
        let template = readFileSync(join(__dirname, "index.html"), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template)
        // 获取页面真实数据--由前段数据产出
        const { render } = await vite.ssrLoadModule("/src/entry-server.js");
        const appHtml = await render();
        // 把读取到的数据替换
        const html = template.replace(`<!--app-html-->`, appHtml);
        // 返回完整数据
        res.send(html);
    })

    app.listen(POST, () => {
        console.log('渲染成功');
    })
}

dataServer();