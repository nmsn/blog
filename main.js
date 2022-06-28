const axios = require("axios");
const path = require("path");
const fs = require("fs");

const issuesUrl = "https://api.github.com/repos/nmsn/blog/issues";
// const issuesLabelUrl = "https://api.github.com/repos/nmsn/blog/labels";

const title = ({ title, level }) => {
  return `${"#".repeat(level)} ${title}`;
};

const link = ({ url, title }) => {
  return `[${title}](${url})`;
};

const tag = (tags) => {
  return `标签：${tags?.join(" | ")}`;
};

const contentItem = ({  url, title, tags }) => {
  return `
  ${link({ url, title })}\n
  ${tag(tags)}
  `;
};

const updateTime = () => {
  return `${new Date().toLocaleDateString()}`;
};

axios(issuesUrl).then((res) => {
  const { data = [] } = res || {};

  const origin = data.map((item) => {
    const { title, url, labels } = item;
    const tags = labels?.map((item) => item.name);
    return { title, url, tags };
  });
  
  const content = origin?.map((item) => contentItem(item)).join('\n');

  const md = `
  ${title({ title: "统计", level: 1 })}
  
  > 更新时间：${updateTime()}
  
  ${content}
  `;

  fs.writeFile("./README.md", md, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    //文件写入成功。
  });
});


console.log(path.join(__dirname, 'README.md'));