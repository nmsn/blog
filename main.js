const axios = require("axios");
const path = require("path");
const fs = require("fs");

const issuesUrl = "https://api.github.com/repos/nmsn/blog/issues?per_page=100";

const formatTitle = ({ title, level }) => {
  return `${"#".repeat(level)} ${title}`;
};

const formatLink = ({ url, title }) => {
  return `[${title}](${url})`;
};

const formatTag = (tag) => {
  return `\`${tag}\``;
};

const formatTags = (tags) => {
  return `${tags.map((item) => formatTag(item))}`;
};

const formatTime = (timeStr) => {
  return new Date(timeStr).toLocaleDateString("zh-CN");
};

const getTableContentItem = ({ url, title, tags, updated_at, comments }) => {
  return `|${formatLink({ url, title })}|${formatTags(tags)}|${formatTime(
    updated_at
  )}|${comments}|`;
};

const getTableContent = (origin) => {
  const content = origin?.map((item) => getTableContentItem(item)).join("\n");

  return `|标题|类型|更新时间|评论数|\n|---|---|---|---|\n${content}`;
};

const updateTime = () => {
  return `${new Date().toLocaleDateString()}`;
};

axios(issuesUrl).then((res) => {
  const { data = [] } = res || {};

  const origin = data.map((item) => {
    const { title, html_url, labels, updated_at, comments } = item;
    const tags = labels?.map((item) => item.name);
    return { title, url: html_url, tags, updated_at, comments };
  });

  const content = getTableContent(origin);

  const md = `${formatTitle({
    title: "汇总",
    level: 1,
  })}\n\n> 更新时间：${updateTime()}\n\n${content}
  `;

  fs.writeFile("./README.md", md, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    //文件写入成功。
  });
});

console.log(path.join(__dirname, "README.md"));
