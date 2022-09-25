import { createLibp2p } from "libp2p";
import { KadDHT } from "@libp2p/kad-dht";
import { Mplex } from "@libp2p/mplex";
import { Noise } from "@chainsafe/libp2p-noise";
import { WebSockets } from "@libp2p/websockets";
import { createFromJSON } from "@libp2p/peer-id-factory";
import { peerIdListener } from "./peer-id-listener.js";
import { GossipSub } from "@chainsafe/libp2p-gossipsub";
import { PubSubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";

const main = async () => {
  const idListener = await createFromJSON(peerIdListener);

  const node = await createLibp2p({
    peerId: idListener,
    addresses: {
      listen: ["/ip4/0.0.0.0/tcp/0/ws"],
    },
    transports: [new WebSockets()],
    streamMuxers: [new Mplex()],
    connectionEncryption: [new Noise()],
    dht: new KadDHT(),
    pubsub: new GossipSub({ allowPublishToZeroPeers: true }),
    peerDiscovery: [new PubSubPeerDiscovery()],
  });

  await node.start();

  console.log(node.peerId.toString());

  node.getMultiaddrs().forEach((ma) => console.log(ma.toString()));
};

main().catch((err) => console.log(err));
