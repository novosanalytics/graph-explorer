# Graph Explorer Tutorial

## Basic Usage

The Graph Explorer provides a means of visualizing data from an AWS Neptune Instance and being able to interact and analyze the data that is available. This document covers the basic usage of the AWS Graph-Explorer and the utility of the features. For further development or technical capability, consult the main docuementation on [a relative link](../../README.md).

## Prerequisites 

In order to get access to the Graph-Explorer and the Neptune database, contact the devs to enable access into the VPC.

To begin exploring the various data graphs that exist, users need to connect to the Neptune Database in order to access the data. Follow the steps below for understanding connection

**Production** 

1. Navigate to the graph-explorer main page on `https://{GE_EC2_INSTANCE}.com/explorer/#/connections` and into the *Available Connection=s* box. If the user encounters an error/warning message about going to an insecure connection on Chrome or Firefox, navigate to "Advanced" section and click on the link that declares `"Continue/Proceed to https://{GE_EC2_INSTANCE}.com/explorer/#/connections"`. On local development, this will be within the localhost connection on `http://localhost:5173`. It's very <u>**IMPORTANT**</u> that prior to running locally, that the user changes the port numbers in the bottom of `packages/graph-explorer-proxy-server/node-server.js` from 443 to 4430 and from 80 to 8000. There are often issues with port forwarding and CORS so these port changes are addressed <u>**ONLY IN LOCAL**</u>. Not changing the ports can issues in the production instance which runs on a Docker container.

2. Once the user has logged, they can create a connection to the Neptune Database. Since the Neptune Database is within a VPC, the users must use a Proxy-Server connection. A typical connection would be enabled in the following manner:
    >- Graph Type: `Gremlin - PG (Property Graph)`
    >- Public or Proxy Endpoint: `https://{GE_EC2_INSTANCE}.com`
    >- Using Proxy-Server: `Checked`
    >- Graph Connection URL: `https://{ NEPTUNE ENDPOINT }.com:8182`
    
    For local development, the user must also make sure that there is an SSH tunnel to interact with the Neptune database AND enable the following settings:
    >- Graph Type: `Gremlin - PG (Property Graph)`
    >- Public or Proxy Endpoint: `http://localhost:8000`
    >- Using Proxy-Server: `Checked`
    >- Graph Connection URL: `https://{ NEPTUNE ENDPOINT }.com:8182`

    Wait a few moments and press "Start Synchronization" or the spinner icon that has hover text of "Synchronize Database"

3. When successful, the spinner should be blue and spinning with the text `The connection is being synchronized` then followed by a filled list of Nodes (blue) and Edges (orange). If there are any issues, contact the NGP developer(s) immediately. 

4. From here, press on the `Open Graph Explorer` button in the top-right to open the Graph-Explorer canvas which should look like the image below. 


## Nodes and Edges 

The essence of the Graph-Explorer is to be able to visualize the nodes and edges and their details on the `canvas` of the graph-explorer. Within the graph-explorer, the user is able to analyze the details of Nodes (Offers, Drugs, etc..) and Edges (J tables, Network Participation, etc ...) simply by clicking on the object itself and it will be displayed on the Details View.

[Insert Node Image Here] [Insert Edge Image Here]

Further, users can also style the attributes of nodes and edges in the `Nodes Styling` and `Edge Styling` tabs of the sidebar including the naming of the objects on the graph. 

[Insrt Images of Node Styling] [Insert Images of Edge Styling]  


The numbers displayed on top of the node is the number of neighbors/connections that the node has 

## Expand by Object

With the nodes, the user is able to view the connections on the graph that a given node has and the types of neighbors it has in the  `Expand by Object` tool in the sidebar. 

[Insert small hover image]

In this tool, each type of neighbor with available connections to the given node is displayed on the right hand side of the `Expand By Object`. From here, the user has several options to view the various neighbors and filter on which neighbors they wish to analyze. A basic connection can be made by choosing the type of neighbor in the drop-down menu in the graph explore followed by pressing on the `Exact Expand` button at the bottom. This will return all possible neighbors of the selected neighbor type.

[Insert Basic Expand here]

The user should note that there is another button on the right called `Full Expand` that will display all possible neighbors for a given node on the `canvas`. Some nodes will have even up to 500 nodes so the user must proceed with caution when doing a `Full Expand` on nodes with greater than 20 neighbor since this will provide 41 objects on the `canvas` for all the nodes and edges.

There are more ways to analyze and find the needed objects with filtering options in the tool. To do so, click the " + " icon on the right hand side of the tool and a form shows below. In this form, this dis

[Insert Filtering Image Here]

The user can assign which attribute out of all possible neighbors to display on the `canvas`, 