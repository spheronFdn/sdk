<p  align="center">

<picture>

<source  media="(prefers-color-scheme: dark)"  srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo-dark.svg">

<source  media="(prefers-color-scheme: light)"  srcset="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg">

<img  alt="Spheron"  src="https://github.com/spheronFdn/sdk/blob/main/.github/assets/spheron-logo.svg" width="250">

</picture>

</p>

<h1  align="center">Spheron CLI</h1>

<p  align="center">
🧰 CLI tool for creating and deploying dapps to web3.
</p>

<p  align="center">

<a  href="https://www.npmjs.com/package/@spheron/storage"  target="_blank"  rel="noreferrer">

<img  src="https://img.shields.io/static/v1?label=npm&message=v2.0.1&color=green"  />

</a>

<a  href="https://github.com/spheronFdn/sdk/blob/main/LICENSE"  target="_blank"  rel="noreferrer">

<img  src="https://img.shields.io/static/v1?label=license&message=Apache%202.0&color=red"  />

</a>

<a  href="https://discord.com/invite/ahxuCtm"  target="_blank"  rel="noreferrer">

<img  src="https://img.shields.io/static/v1?label=community&message=discord&color=blue"  />

</a>

<a  href="https://twitter.com/SpheronFdn"  target="_blank"  rel="noreferrer">

<img  src="https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40SpheronFdn"  />

</a>

</p>

## Usage:

<p>To use Spheron CLI, you need to first install it using the following command:</p>

<pre><code>sudo npm install -g @spheron/cli</code></pre>

<p>Once you have installed the CLI, you can use the following commands to create and deploy dapps to web3:</p>

#

<h3>spheron init</h3>
<p>Use <code>spheron init</code> to initialize a deployment configuration and create a Spheron configuration file in your project directory.</p>
<pre><code>spheron init</code></pre>

<code>spheron init [--import {DOCKER COMPOSE PATH}] [--dockerFile {DOCKERFILE PATH}] [--marketplace {APP ID}]</code>
You can update this file manually afterwards to change default settings.

**_Params options_**

**import** - relative path to docker compose file

**dockerFile** - relative path to dockerfile

**marketplace** - marketplace app ID

#

<h3>spheron deploy</h3>
<p>Use <code>spheron publish</code> to deploy your instance — Uses the spheron.yaml file to launch your instance. </p>
<pre><code>spheron deploy</code></pre> 
This command will look up at your spheron.yaml file and use its configuration to deploy the instance.

#

<h3>spheron create-organization</h3>
<p>Use <code>spheron create-organization</code> if you want to create a new organization. This will set that organization as default and will use it later for upload/publish commands by default. Keep in mind that first time you execute <code>spheron login</code> command, you will get new organization created if you already didn't have one set up.   </p>
<pre><code>spheron create-organization</code></pre> 
This will open up a prompter that will help you set up your new organization. If you want to directly call it without prompter you can use:

<code>spheron create-organization --name {organization_name} --username {organization_username} </code>

**_Params options_**

**name\*** - name of your organization

**username\*** - username represent short name for your organization.

> **Note**: \* stands for mandatory (if all of mandatory params are not sent, prompter will be opened)

#

<h3>spheron login</h3>
<p>Use <code>spheron login</code> to connect to your Spheron account. This command will allow you to authenticate to Spheron and is mandatory to execute before doing <code>upload</code> or <code>publish</code> commands.</p>
<pre><code>spheron login</code></pre> 
This will open up a prompter that will help you set up your new organization. If you want to directly call it without prompter you can use:

<code>spheron login [--github | --gitlab | --bitbucket] </code>

## Learn More

You can learn more about Spheron and Spheron CLI here:

- [Spheron Discord](https://discord.com/invite/ahxuCtm)

- [Spheron Twitter](https://twitter.com/SpheronFdn)
