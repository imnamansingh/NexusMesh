import { createGrpcTransport } from '@connectrpc/connect-node';
import { createClient } from '@connectrpc/connect';
import { MeshService } from '../generated/mesh_connect.js'

const CPP_SERVICE_URL = process.env.CPP_SERVICE_URL;

const transport = createGrpcTransport({
  baseUrl: CPP_SERVICE_URL,
  httpVersion: '2',
});

export const meshClient = createClient(MeshService, transport);