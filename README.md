[![npm version](https://badge.fury.io/js/asd-agent.svg)](https://badge.fury.io/js/asd-agent)
[![Build Status](https://travis-ci.org/innowatio/asd-agent.svg?branch=master)](https://travis-ci.org/innowatio/asd-agent)
[![Dependency Status](https://david-dm.org/innowatio/asd-agent.svg)](https://david-dm.org/innowatio/asd-agent)
[![devDependency Status](https://david-dm.org/innowatio/asd-agent/dev-status.svg)](https://david-dm.org/innowatio/asd-agent#info=devDependencies)

# asd-agent

Deploy static web-apps on AWS

## Setup

For update the `asd-agent` server, you should
```
npm i -g asd-agent
```

After that, you should stop the [`forever`](https://github.com/foreverjs/forever) daemon

```sh
forever stop "id"
```

setup the environment variables:

```sh
export S3_BUCKET="S3_BUCKET"
export SNS_TOPIC_ARN="SNS_TOPIC_ARN"
```

and start the updated `asd-agent`

```sh
forever start $(which asd-agent)
```
