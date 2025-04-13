## Network Configuration

To begin using DELTA's data exploration and management features for a specific network, follow these steps:

1.  **Access the Settings Section:** Navigate to the "Settings" section within the DELTA interface.

2.  **Add a New Network:** Within the settings section, the option to add a new network appears first.

3.  **Specify Network Parameters:** When adding a new network, you will be prompted for the following specific parameters:

    * **Network Name:** A descriptive name to identify the network (e.g., "Ethereum Mainnet," "sepolia testnet", ect).
    * **Chain ID:** The unique identifier of the blockchain (e.g., 1 for Ethereum Mainnet, 11155111 for sepolia testnet, ).
    * **RPC Node URL:** The URL of the Remote Procedure Call (RPC) endpoint to interact with the network. This is the endpoint to which DELTA will send requests to obtain blockchain data.
    * **Token Contract Address:** The smart contract address of the regulated ERC20 token you wish to track on this network.
    * **Start Indexing From Block Number:** The block number from which DELTA will begin synchronizing and processing events for the specified token.
    * **Number of Blocks Per Request:** The number of blocks of data that DELTA will request from the RPC node in each individual request.

    **Important Warning Regarding RPC Requests:**

    Making RPC requests with high values for "Number of Blocks Per Request" can result in very large requests. Some RPC node providers, **including Google's public RPC**, may **reject** these requests if they exceed their size or response capacity limits. It is recommended to start with low values (e.g., **5 or less**) and gradually increase them if you experience slow synchronization, always monitoring the RPC node's response. Excessively high values can overload the node and lead to errors or disconnection of your application.

Once you have entered and saved the network configuration, DELTA will begin the token data synchronization process from the specified block, using the configured request interval. You can monitor the synchronization progress within the application interface.
