import Header from "./Header"
import Footer from "./Footer"

const Layout = ({ children }) => {
    return (
        <div>
            <Header />
            <main className="h-screen flex items-center justify-center">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout