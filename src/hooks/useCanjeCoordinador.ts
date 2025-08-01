// import { useState, useCallback } from 'react';
// import { useClientes } from './useClientes';
// import { useCodigoGenerado } from './useCodigoGenerado';
// import {
//     DatosCanje,
//     ValidacionCompleta,
//     ConfirmacionCanje,
//     ValidacionDni,
//     ValidacionCodigo
// } from '@/types/canje';

// /**
//  * Hook coordinador que maneja todo el flujo de validación y canje
//  * Combina validaciones de DNI, código y realiza el canje final
//  */
// export const useCanjeCoordinador = () => {
//     const [isValidating, setIsValidating] = useState(false);
//     const [isConfirming, setIsConfirming] = useState(false);
//     const [validacionActual, setValidacionActual] = useState<ValidacionCompleta | null>(null);

//     // Hooks de validación
//     const { validarDni, isValidatingDni } = useClientes();
//     const {
//         validarCodigo,
//         realizarCanje,
//         isValidatingCodigo,
//         isRealizandoCanje
//     } = useCodigoGenerado(null);

//     /**
//      * Paso 1: Validar todos los datos de entrada
//      */
//     const validarDatosCanje = useCallback(async (datos: DatosCanje): Promise<ValidacionCompleta> => {
//         setIsValidating(true);

//         try {
//             logger.log('🔍 Iniciando validación de datos de canje...', datos);

//             // Validar DNI
//             logger.log('📋 Validando DNI...');
//             const validacionDni: ValidacionDni = await validarDni(datos.dni_cliente);

//             if (!validacionDni.dni_valido) {
//                 return {
//                     dni_valido: false,
//                     codigo_valido: false,
//                     puede_canjear: false,
//                     tipo: 'cliente',
//                     codigo_publico: datos.codigo,
//                     nro_ticket: datos.nro_ticket,
//                     mensaje: validacionDni.mensaje,
//                     razon_no_canje: 'DNI inválido'
//                 };
//             }

//             // Validar código
//             logger.log('🎫 Validando código...');
//             const validacionCodigo: ValidacionCodigo = await validarCodigo(datos.codigo);

//             if (!validacionCodigo.codigo_valido) {
//                 return {
//                     dni_valido: true,
//                     codigo_valido: false,
//                     puede_canjear: false,
//                     cliente: validacionDni.cliente,
//                     tipo: validacionCodigo.tipo,
//                     codigo_publico: datos.codigo,
//                     nro_ticket: datos.nro_ticket,
//                     mensaje: validacionCodigo.mensaje,
//                     razon_no_canje: validacionCodigo.razon_no_canje || 'Código inválido'
//                 };
//             }

//             // Ambas validaciones exitosas
//             const resultado: ValidacionCompleta = {
//                 dni_valido: true,
//                 codigo_valido: true,
//                 puede_canjear: validacionCodigo.puede_canjear,
//                 cliente: validacionDni.cliente,
//                 tarjeta: validacionCodigo.tarjeta,
//                 producto: validacionCodigo.producto,
//                 tipo: validacionCodigo.tipo,
//                 codigo_publico: datos.codigo,
//                 nro_ticket: datos.nro_ticket,
//                 mensaje: validacionCodigo.puede_canjear
//                     ? 'Validación exitosa, listo para canjear'
//                     : validacionCodigo.mensaje,
//                 razon_no_canje: validacionCodigo.puede_canjear
//                     ? undefined
//                     : validacionCodigo.razon_no_canje
//             };

//             setValidacionActual(resultado);
//             logger.log('✅ Validación completa:', resultado);

//             return resultado;

//         } catch (error) {
//             console.error('❌ Error en validación:', error);

//             const errorResult: ValidacionCompleta = {
//                 dni_valido: false,
//                 codigo_valido: false,
//                 puede_canjear: false,
//                 tipo: 'cliente',
//                 codigo_publico: datos.codigo,
//                 nro_ticket: datos.nro_ticket,
//                 mensaje: error instanceof Error ? error.message : 'Error desconocido en validación',
//                 razon_no_canje: 'Error del sistema'
//             };

//             return errorResult;

//         } finally {
//             setIsValidating(false);
//         }
//     }, [validarDni, validarCodigo]);

//     /**
//      * Paso 2: Confirmar y realizar el canje
//      */
//     const confirmarCanje = useCallback(async (confirmacion: ConfirmacionCanje): Promise<void> => {
//         if (!validacionActual?.puede_canjear) {
//             throw new Error('No se puede realizar el canje - validación inválida');
//         }

//         setIsConfirming(true);

//         try {
//             logger.log('💫 Confirmando canje...', confirmacion);

//             const resultado = await realizarCanje({
//                 usu_dni: confirmacion.usu_dni,
//                 cod_publico: confirmacion.cod_publico,
//                 cod_nro_ticket: confirmacion.cod_nro_ticket
//             });

//             if (!resultado.canje_exitoso) {
//                 throw new Error(resultado.mensaje || 'El canje no pudo completarse');
//             }

//             logger.log('✅ Canje realizado exitosamente:', resultado);

//             // Limpiar validación actual después del canje exitoso
//             setValidacionActual(null);

//         } catch (error) {
//             console.error('❌ Error al confirmar canje:', error);
//             throw error;
//         } finally {
//             setIsConfirming(false);
//         }
//     }, [validacionActual, realizarCanje]);

//     /**
//      * Limpiar estado actual
//      */
//     const limpiarValidacion = useCallback(() => {
//         setValidacionActual(null);
//     }, []);

//     /**
//      * Estado de carga combinado
//      */
//     const isLoading = isValidating || isConfirming || isValidatingDni || isValidatingCodigo || isRealizandoCanje;

//     return {
//         // Funciones principales
//         validarDatosCanje,
//         confirmarCanje,
//         limpiarValidacion,

//         // Estados
//         validacionActual,
//         isValidating,
//         isConfirming,
//         isLoading,

//         // Estados detallados
//         isValidatingDni,
//         isValidatingCodigo,
//         isRealizandoCanje
//     };
// };