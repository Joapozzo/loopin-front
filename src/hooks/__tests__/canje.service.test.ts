import { CanjeService } from "@/services/canje.service"; 

// Mock del ApiClient
jest.mock('@/api/api', () => ({
    ApiClient: jest.fn().mockImplementation(() => ({
        get: jest.fn(),
        post: jest.fn(),
    }))
}));

describe('CanjeService', () => {
    let canjeService: CanjeService;
    let mockApiClient: any;

    beforeEach(() => {
        // Crear instancia fresh para cada test
        canjeService = new CanjeService();
        mockApiClient = (canjeService as any).api;
        jest.clearAllMocks();
    });

    describe('validarCodigoPromocion', () => {
        test('debería validar código promocional correctamente', async () => {
            // Arrange
            const mockResponse = {
                codigo_promocional: {
                    cod_prom_publico: 'PROMO123',
                    pro_nom: 'Descuento 50%'
                },
                mensaje: 'Código válido'
            };

            mockApiClient.get.mockResolvedValue(mockResponse);

            // Act
            const result = await canjeService.validarCodigoPromocion('PROMO123', '12345678');

            // Assert
            expect(mockApiClient.get).toHaveBeenCalledWith('/codigos_promocion/validar?codigo=PROMO123&dni=12345678');
            expect(result).toEqual(mockResponse);
        });

        test('debería construir URL con parámetros correctos', async () => {
            // Arrange
            mockApiClient.get.mockResolvedValue({});

            // Act
            await canjeService.validarCodigoPromocion('ABC123', '87654321');

            // Assert
            expect(mockApiClient.get).toHaveBeenCalledWith('/codigos_promocion/validar?codigo=ABC123&dni=87654321');
        });
    });

    describe('validarCodigoCliente', () => {
        test('debería validar código de cliente correctamente', async () => {
            // Arrange
            const mockResponse = {
                codigo_cliente: {
                    cli_nom: 'Juan',
                    cli_ape: 'Pérez'
                },
                mensaje: 'Cliente válido'
            };

            mockApiClient.get.mockResolvedValue(mockResponse);

            // Act
            const result = await canjeService.validarCodigoCliente('CLI456', '11223344');

            // Assert
            expect(mockApiClient.get).toHaveBeenCalledWith('/codigos_clientes/validar?codigo=CLI456&dni=11223344');
            expect(result).toEqual(mockResponse);
        });
    });
});