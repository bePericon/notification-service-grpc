import { createEmailServer } from './server';
import * as grpc from '@grpc/grpc-js';

const PORT = process.env.PORT || 50052;

const main = () => {
	const server = createEmailServer();

	server.bindAsync(
		`0.0.0.0:${PORT}`,
		grpc.ServerCredentials.createInsecure(),
		(err: Error | null, port: number) => {
			if (err) {
				console.error(`Error al iniciar el servidor gRPC: ${err.message}`);
			} else {
				console.log(`Servidor gRPC iniciado en el puerto ${port}`);
				server.start();
			}
		}
	);
};

main();
