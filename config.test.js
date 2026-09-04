const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const config = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "config.json"), "utf8"),
);

const legacyIos = {
  enabled: true,
  minVersion: "1.0.44",
  latestVersion: "1.1.5",
  storeDeepLink: "itms-apps://apps.apple.com/app/id6749572182",
  storeWebUrl: "https://apps.apple.com/app/id6749572182",
  messages: {
    critical: {
      title: "Необходимо обновление",
      description: "Для продолжения работы\nпожалуйста обновите приложение",
      updateLabel: "Обновить",
    },
    optional: {
      title: "Доступно обновление",
      description: "Пожалуйста обновите приложение\nдо последней версии",
      updateLabel: "Обновить",
      laterLabel: "Позже",
    },
  },
};

const legacyAndroid = {
  enabled: true,
  minVersion: "1.0.44",
  latestVersion: "1.1.5",
  storeDeepLink: "market://details?id=com.goldtech.goldline",
  storeWebUrl: "https://play.google.com/store/apps/details?id=com.goldtech.goldline&pli=1",
  messages: {
    critical: {
      title: "Необходимо обновление",
      description: "Для продолжения работы\nпожалуйста обновите приложение",
      updateLabel: "Обновить",
    },
    optional: {
      title: "Доступно обновление",
      description: "Пожалуйста обновите приложение\nдо последней версии",
      updateLabel: "Обновить",
      laterLabel: "Позже",
    },
  },
};

const messages = {
  messages: {
    critical: {
      title: "Необходимо обновление",
      description: "Для продолжения работы\nпожалуйста обновите приложение",
      updateLabel: "Обновить",
    },
    optional: {
      title: "Доступно обновление",
      description: "Пожалуйста обновите приложение\nдо последней версии",
      updateLabel: "Обновить",
      laterLabel: "Позже",
    },
  },
};

const policy = (minVersion, latestVersion) => ({
  enabled: true,
  minVersion,
  latestVersion,
  ...messages,
});

test("updater publishes the v2 brand policy matrix while preserving Goldline roots", () => {
  assert.deepEqual(config.ios, legacyIos);
  assert.deepEqual(config.android, legacyAndroid);
  assert.deepEqual(Object.keys(config).sort(), ["android", "brands", "ios", "schemaVersion"]);
  assert.equal(config.schemaVersion, 2);
  assert.deepEqual(Object.keys(config.brands).sort(), [
    "aurumlight",
    "faceconcept",
    "goldline",
    "vozrastanet",
  ]);
  assert.deepEqual(config.brands, {
    goldline: {
      platforms: { ios: policy("1.0.44", "1.1.6"), android: policy("1.0.44", "1.1.6") },
    },
    aurumlight: {
      platforms: { ios: policy("1.0.0", "1.1.6"), android: policy("1.0.0", "1.1.6") },
    },
    faceconcept: {
      platforms: { ios: policy("1.0.0", "1.1.6"), android: policy("1.0.0", "1.1.6") },
    },
    vozrastanet: {
      platforms: { ios: policy("1.0.0", "1.1.7") },
    },
  });
});
