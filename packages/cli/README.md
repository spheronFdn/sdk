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

<img  src="https://img.shields.io/static/v1?label=npm&message=v1.0.11&color=green"  />

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

<h3>spheron create-dapp</h3>
<p>Use <code>spheron create-dapp</code> to create a template project that will easily be deployed on Spheron later. </p>
<pre><code>spheron create-dapp</code></pre> 
This will open up a prompter that will allow you to select what kind of a template you want to create. If you want to directly call it without prompter you can use:

<code>spheron create-dapp --protocol {protocol} [--project {project_name}] [--path {path}] [--framework {framework}]</code>

**_Params options_**

**protocol\*** - [arweave/filecoin/ipfs]

**project** - name (if not provided, path last segment will be taken by default)

**path** - where is the location of dir/file that you want to upload (default is ./)

**framework** -[static/react/vue/angular/next/preact/nuxt2/docusaurus/hugo/eleventy/svelte/gatsby/sanity/ionicreact/vite/scully/stencil/brunch/ionicangular]

> **Note**: \* stands for mandatory (if all of mandatory params are not sent, prompter will be opened)

#

<h3>spheron init</h3>
<p>Use <code>spheron init</code> to initialize a new Spheron project. This will create a new spheron.json file in your current path. This spheron.json file is a file describing your project. It will be used for <code> spheron publish </code> command. See more in spheron publish command section.</p>
<pre><code>spheron init</code></pre> 
This will open up a prompter that will prompt you to describe your project. If you want to directly call it without prompter you can use:

<code>spheron init --protocol {protocol} [--project {project_name}] [--path {path}] [--framework {framework}]</code>
You can update this file manually afterwards to change default settings.

**_Params options_**

**protocol\*** - [arweave/filecoin/ipfs]

**project** - name (if not provided, path last segment will be taken by default)

**path** - where is the location of dir/file that you want to upload (default is ./)

**framework** -[static/react/vue/angular/next/preact/nuxt2/docusaurus/hugo/eleventy/svelte/gatsby/sanity/ionicreact/vite/scully/stencil/brunch/ionicangular]

> **Note**: \* stands for mandatory (if all of mandatory params are not sent, prompter will be opened)

#

<h3>spheron publish</h3>
<p>Use <code>spheron publish</code> to upload your project configuration described in spheron.json file of your project. </p>
<pre><code>spheron publish</code></pre> 
This command will look up at your spheron.json file and  use its configuration to upload the project.

#

<h3>spheron upload</h3>
<p>Use <code>spheron upload</code> if you want to directly upload your file/directory to the specific protocol without need to setup the project. Using this command expects you to be logged in previously. To do that use <code>spheron login</code> before upload. </p>
<pre><code>spheron upload</code></pre> 
This will open up a prompter that will prompt you to describe how you want to upload your directory/file. If you want to directly call it without prompter you can use:

<code>spheron upload --path {file_path} --protocol {protocol} [--bucket {bucket_name}] [--organization {organizationId}] </code>

**_Params options_**

**path\*** - where is the location of dir/file that you want to upload (default is ./)

**protocol\*** - [arweave/filecoin/ipfs]

**bucket** - name (if not provided, path last segment will be taken by default)

**organization** - you can override organizationId that will be used. By default it will take one that you have received after executing <code>spheron login</code>

> **Note**: \* stands for mandatory (if all of mandatory params are not sent, prompter will be opened)

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
