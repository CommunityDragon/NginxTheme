import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Config } from "@react-router/dev/config";
import colors from "picocolors";
import { version } from "vite";

export default {
  appDirectory: "src",
  ssr: false,
  prerender: ["/"],
  buildEnd({ reactRouterConfig, viteConfig }) {
    const startTime = performance.now();
    const logger = viteConfig.logger;

    const clientBuildDirectory = path.join(
      reactRouterConfig.buildDirectory,
      "client",
    );

    const indexFile = "index.html";
    const headerFile = "header.html";
    const footerFile = "footer.html";

    const prettyDir = path.relative(viteConfig.root, clientBuildDirectory);

    logger.info(
      colors.cyan(
        `vite v${version} ${colors.green(
          `building nginx environment for ${viteConfig.mode}...`,
        )}`,
      ),
    );

    logger.info(
      `${colors.green("✓")} 2 assets generated for nginx environment.`,
    );

    logger.info(colors.dim(path.join(prettyDir, headerFile)));
    const content = readFileSync(
      path.join(clientBuildDirectory, indexFile),
      "utf-8",
    );
    let [headerContent, ...footerParts] = content.split(
      '<template id="nginx-index"',
    );

    headerContent = `${headerContent}<template id="nginx-index"><h1>`;
    writeFileSync(path.join(clientBuildDirectory, headerFile), headerContent);

    logger.info(colors.dim(path.join(prettyDir, footerFile)));
    [, ...footerParts] = footerParts
      .join('<template id="nginx-index"')
      .split("</template>");
    const footerContent = `</template>${footerParts.join("</template>")}`;
    writeFileSync(path.join(clientBuildDirectory, footerFile), footerContent);

    logger.info(
      `\nRemoving ${indexFile} from ${colors.green(clientBuildDirectory)} due to nginx environment`,
    );
    rmSync(path.join(clientBuildDirectory, indexFile));

    const endTime = performance.now();
    logger.info(
      colors.green(
        `✓ built in ${Math.round((endTime - startTime) / 10) / 100}s`,
      ),
    );
  },
} satisfies Config;
