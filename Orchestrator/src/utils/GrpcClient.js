import { createGrpcTransport } from '@connectrpc/connect-node';
import { createPromiseClient } from '@connectrpc/connect';
import { MeshService } from '../generated/mesh_connect.js'

// 1. Create a single HTTP/2 transport instance (reusable connection channel)
const CPP_SERVICE_URL = process.env.CPP_SERVICE_URL || 'http://localhost:50051';

const transport = createGrpcTransport({
  baseUrl: CPP_SERVICE_URL,
  httpVersion: '2',
});

export const meshClient = createPromiseClient(MeshService, transport);
