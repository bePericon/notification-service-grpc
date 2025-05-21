import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

// Importa solo las interfaces de los mensajes desde el archivo generado por ts-proto
// NO importes 'EmailService' aquí para tipar directamente 'emailServiceHandlers'
// porque no es compatible con 'UntypedServiceImplementation'.
import { SendEmailRequest, SendEmailResponse } from '../generated/email'; // Ruta a tu 'email.ts' generado
import { sendMail } from './services/email-service';

const PROTO_FILE = './src/proto/email.proto'; // Ruta a tu archivo .proto original

// Carga la definición del paquete Protobuf/gRPC usando protoLoader
const packageDefinition = protoLoader.loadSync(PROTO_FILE, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const emailPackage = protoDescriptor.email as any; // Accede al paquete 'email'

// Implementación de los handlers del servicio de Email
// Explicitamente tipificamos los parámetros de call y callback.
// El objeto de handlers DEBE ser de tipo grpc.UntypedServiceImplementation
const emailServiceHandlers: grpc.UntypedServiceImplementation = {
	SendEmail: (
		call: grpc.ServerUnaryCall<SendEmailRequest, SendEmailResponse>,
		callback: grpc.sendUnaryData<SendEmailResponse>
	) => {
		const { to, subject, body } = call.request;

		console.log(`Recibida solicitud de envío de email:`);
		console.log(`  Para: ${to}`);
		console.log(`  Asunto: ${subject}`);
		console.log(`  Cuerpo: ${body}`);

		if (to && subject && body) {
			sendMail(to, subject, body);
			callback(null, { success: true, message: 'Email enviado exitosamente.' });
		} else {
			console.error('Error: Campos de email incompletos.');
			callback(
				{
					code: grpc.status.INVALID_ARGUMENT,
					details: 'Faltan campos obligatorios para el envío del email.',
					metadata: new grpc.Metadata(),
				},
				null
			);
		}
	},
	// Si tu servicio tuviera más métodos, irían aquí con sus propias firmas
	// por ejemplo: AnotherMethod: (call: grpc.ServerUnaryCall<Req, Res>, callback: grpc.sendUnaryData<Res>) => { ... }
};

export function createEmailServer(): grpc.Server {
	const server = new grpc.Server();
	server.addService(emailPackage.EmailService.service, emailServiceHandlers);
	return server;
}
