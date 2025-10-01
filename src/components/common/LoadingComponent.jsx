export default function LoadingComponent() {
    return (
        <div className="flex items-center justify-center min-h-3/4 p-5 bg-transparent min-w-screen">

            <div className="flex space-x-2 animate-pulse">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
        </div>
    )
}