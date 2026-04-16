import { defineConfig } from '@playwright/test';
import { createAzurePlaywrightConfig, ServiceOS } from '@azure/playwright';
import { DefaultAzureCredential } from '@azure/identity';
import config from './playwright.config.js';

const serviceUrl = process.env.PLAYWRIGHT_SERVICE_URL;
const enableAzureReporter = process.env.PLAYWRIGHT_ENABLE_REPORTING === 'true';

export default serviceUrl
  ? defineConfig(
      config,
      createAzurePlaywrightConfig(config, {
        exposeNetwork: '<loopback>',
        connectTimeout: 3 * 60 * 1000,
        os: ServiceOS.LINUX,
        credential: new DefaultAzureCredential(),
      }),
      {
        reporter: enableAzureReporter
          ? [
              ['html', { open: 'never' }],
              ['allure-playwright'],
              ['line'],
              ['list'],
              ['@azure/playwright/reporter'],
            ]
          : [['html', { open: 'never' }], ['allure-playwright'], ['line'], ['list']],
      }
    )
  : defineConfig(config);
