interface SideBarStep2Props {
    data: {
        nombre: string
        apellido: string
        dni: string
        celular: string
        localidad: string
        provincia: string
    }
}

const SideBarStep2 = ({ data }: SideBarStep2Props) => {
    return (
        <>
            <h1 className="text-4xl font-bold mb-4">¡Ya casi terminamos!</h1>
            <p className="text-lg opacity-90 mb-6">
                Solo falta configurar tu cuenta para empezar a disfrutar todos los beneficios de Loopin.
            </p>

            {/* Resumen de datos del paso 1 */}
            <div className="p-4 bg-white/10 rounded-2xl mb-6">
                <h3 className="font-semibold text-lg mb-3">Datos confirmados:</h3>
                <div className="space-y-2 text-sm">
                    <p><span className="opacity-80">Nombre:</span> {data.nombre} {data.apellido}</p>
                    <p><span className="opacity-80">DNI:</span> {data.dni}</p>
                    <p><span className="opacity-80">Celular:</span> {data.celular}</p>
                    <p><span className="opacity-80">Ubicación:</span> {data.localidad}, {data.provincia}</p>
                </div>
            </div>

            <div className="mt-6 p-4 bg-white/10 rounded-xl">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold">500+</div>
                        <div className="text-sm opacity-80">Restaurantes</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">10K+</div>
                        <div className="text-sm opacity-80">Usuarios activos</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SideBarStep2