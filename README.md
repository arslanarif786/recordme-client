<a>
	<img src="https://client.recordme.ai/img/logo.84baa683.svg" width="200px" align="right">
 </a>
 
 
 # RecordMe
 
 
 <!-- ## Introduction -->

 <!-- RecordMe  -->

 <br>
 <details Open>
   <summary><b>Table of Contents</b></summary>
   <ol>
	 <li><a href="#project-overview">Overview</a></li>
	 <li><a href="#frontend-details">Frontend Details </a> </li>
	 <ul>
	  <li>
		 <a href="#stack-used">
		Stack Used
		  </a>
		 </li>
		 <li>
		   <a href="#installation-procedure">Installation Procedure</a>
		 </li>
		 <li>
		   <a href="#directory-structure">Directory Structure</a>
		 </li>
	 </ul>
	 <!-- </li> -->
     <li><a href="#third-party-integrations"> Third Party Integrations</a></li>
	 <!-- </li> -->
	 <li><a href="#environment-urls">Environment URL(s)</a></li>
   </ol>
 </details>
 
  
 <br>
 
 # RecordMe:
 
 ## Project Overview 
 
 <hr>
 <!-- RecordMe is an accounting software which is working as an aggregator service. Clients will be provided by a separate portal where they can create tickets to perform accounting  -->

 <br>
 
 # Frontend Details

## Stack Used

- [VueJs](https://vuejs.org/)

# Installation Procedure


<details Open>
<summary>Manual Installation</summary>
<ol>
	
#### Clone the repo (default branch `production-frontend-latestUI`)

```
git clone -b production-frontend-latestUI https://github.com/Developers-Studio-Limited/RecordMe-Client.git
```

```
npm install
```

### Configuration

```
cp .env.example .env
```

Set .env file according to your required URLs

```
VUE_APP_ENVIRONMENT=local
VUE_APP_BACK_END_URL=
VUE_APP_SOCKET_URL=
```

### To run project locally:

```
npm run serve
```

</ol>

</details>


<hr>
<br>

# Directory Structure

```
iFrame-fe
├─ Docker (Default configuration file)
├─ Dockerfile
├─ docker-compose.yml
├─ public
├─ src
│  ├─ app
│  │  ├─ App.vue
│  │  ├─ components
│  │  ├─ main.js
│  │  ├─ router
│  │  │  └─ index.js
│  │  ├─ store
│  │  │  ├─ index.js
│  │  ├─ utils
│  │  └─ views
│  ├─ assets (All icons, images and SVGs)
│  ├─ common
│  │  ├─ components (Common components)
│  ├─ constants
│  ├─ fonts (font family)
│  ├─ js (Global JS files)
│  ├─ plugins (Vuetify plugin file)
│  └─ services (API service files)

```



<hr>

## Environment URL(s):

| Environment                                     | Portal                  | Email                     | Password    | 
| ----------------------------------------------- | ----------------------- | ------------------------  | ----------- | 
| [Development](https://dev-client.recordme.ai/)  | Client Portal           | -                         | -           |

<hr>
