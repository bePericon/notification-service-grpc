// src/client.ts - Debería estar bien como estaba

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

// Solo importamos las interfaces de los mensajes desde el archivo generado por ts-proto
import { SendEmailRequest, SendEmailResponse } from '../generated/email';

const PROTO_FILE = './src/proto/email.proto';
const SERVER_ADDRESS = 'localhost:50051';

const packageDefinition = protoLoader.loadSync(PROTO_FILE, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const emailPackage = protoDescriptor.email as any;

const client = new emailPackage.EmailService(
	SERVER_ADDRESS,
	grpc.credentials.createInsecure()
);

const sendEmail = (request: SendEmailRequest) => {
	client.SendEmail(
		request,
		(error: grpc.ServiceError | null, response: SendEmailResponse | undefined) => {
			if (error) {
				console.error(
					'Error al enviar el email:',
					error.details || error.message
				);
				return;
			}
			console.log('Respuesta del servidor:', response);
		}
	);
};

sendEmail({
	to: 'test@example.com',
	subject: 'Hola desde gRPC',
	body: 'Este es un email de prueba enviado a través de gRPC con Node.js y TypeScript.',
});

sendEmail({
	to: 'otro@example.com',
	subject: 'Email con campos incompletos',
	body: '',
});
