const { execSync } = require('child_process');
const userInfo = require('os').userInfo;

const runningEnv = process.env.NODE_ENV || 'production';

require('dotenv').config({
  path: `.env.${runningEnv}`,
});

const getGitBranch = () => {
  return execSync('git rev-parse --abbrev-ref HEAD')
    .toString('utf8')
    .replace(/[\n\r\s]+$/, '');
};

const getContentBranch = () => {
  return process.env.GATSBY_SNOOTY_DEV ? getGitBranch() : process.env.GATSBY_PARSER_BRANCH;
};

const getPathPrefix = () => {
  const user = userInfo().username;
  const branch = getContentBranch();

  return runningEnv === 'production' ? `/${process.env.GATSBY_SITE}/${user}/${branch}` : '/';
};

module.exports = {
  pathPrefix: getPathPrefix(),
  plugins: ['gatsby-plugin-react-helmet'],
  siteMetadata: {
    branch: getContentBranch(),
    project: process.env.GATSBY_SITE,
    title: 'MongoDB Guides',
    user: userInfo().username,
    menuLinks: [
      {
        url: 'https://docs.mongodb.com/',
        text: 'Docs Home',
      },
      {
        url: 'https://docs.mongodb.com/',
        text: 'Documentation',
        open: true,
        children: [
          {
            url: 'https://docs.mongodb.com/manual/',
            text: 'MongoDB Server',
            textShort: 'Server',
            topNav: true,
          },
          {
            url: 'https://docs.mongodb.com/stitch/',
            text: 'MongoDB Stitch',
            topNav: false,
          },
          {
            url: 'https://docs.mongodb.com/ecosystem/drivers/',
            text: 'Drivers',
            open: false,
            topNav: true,
            children: [
              {
                url: 'http://mongoc.org/libmongoc/current/',
                text: 'C',
              },
              {
                url: 'https://mongodb.github.io/mongo-cxx-driver/',
                text: 'C++11',
              },
              {
                url: 'https://docs.mongodb.com/ecosystem/drivers/csharp/',
                text: 'C#',
              },
              {
                url: 'http://mongodb.github.io/mongo-java-driver/',
                text: 'Java',
              },
              {
                url: 'https://mongodb.github.io/node-mongodb-native/',
                text: 'Node.js',
              },
              {
                url: 'https://docs.mongodb.com/ecosystem/drivers/perl/',
                text: 'Perl',
              },
              {
                url: 'https://docs.mongodb.com/ecosystem/drivers/php/',
                text: 'PHP',
              },
              {
                url: 'https://docs.mongodb.com/ecosystem/drivers/python/',
                text: 'Python',
              },
              {
                url: 'https://docs.mongodb.com/ecosystem/drivers/ruby/',
                text: 'Ruby',
              },
              { url: 'https://docs.mongodb.com/ecosystem/drivers/scala/', text: 'Scala' },
            ],
          },
          {
            url: 'https://docs.mongodb.com/cloud/',
            text: 'Cloud',
            open: true,
            topNav: true,
            children: [
              { url: 'https://docs.atlas.mongodb.com/', text: 'MongoDB Atlas' },
              {
                url: 'https://docs.cloudmanager.mongodb.com/',
                text: 'MongoDB Cloud Manager',
              },
              {
                url: 'https://docs.opsmanager.mongodb.com/current/',
                text: 'MongoDB Ops Manager',
              },
            ],
          },
          {
            url: 'https://docs.mongodb.com/tools/',
            text: 'Tools',
            open: true,
            topNav: true,
            children: [
              {
                url: 'https://docs.mongodb.com/atlas-open-service-broker/current/',
                text: 'MongoDB Atlas Open Service Broker',
              },
              {
                url: 'https://docs.mongodb.com/bi-connector/current/',
                text: 'MongoDB BI Connector',
              },
              {
                url: 'https://docs.mongodb.com/charts/saas/',
                text: 'MongoDB Charts',
              },
              {
                url: 'https://docs.mongodb.com/compass/current/',
                text: 'MongoDB Compass',
              },
              {
                url: 'https://docs.mongodb.com/kubernetes-operator/stable/',
                text: 'MongoDB Enterprise Kubernetes Operator',
              },
              {
                url: 'https://docs.mongodb.com/kafka-connector/current/',
                text: 'MongoDB Kafka Connector',
              },
              {
                url: 'https://docs.mongodb.com/spark-connector/current/',
                text: 'MongoDB Spark Connector',
              },
            ],
          },
          {
            url: 'https://docs.mongodb.com/guides/',
            text: 'Guides',
            topNav: true,
          },
        ],
      },
      {
        url: 'https://www.mongodb.com/',
        text: 'Company',
      },
      { url: 'https://university.mongodb.com/', text: 'Learn' },
      {
        url: 'https://www.mongodb.com/community',
        text: 'Community',
      },
      { url: 'https://www.mongodb.com/what-is-mongodb', text: 'What is MongoDB' },
      {
        url: 'https://www.mongodb.com/download-center?jmp=docs',
        text: 'Get MongoDB',
      },
      {
        url: 'https://www.mongodb.com/contact?jmp=docs',
        text: 'Contact Us',
      },
    ],
  },
};
