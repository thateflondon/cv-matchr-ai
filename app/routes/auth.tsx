import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () => ([
    { title: 'CV Matchr AI | Auth'},
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {

    const { isLoading, auth } = usePuterStore(); // Vérifie l'état de chargement et l'authentification
    const location = useLocation(); // Page sur laquelle on se situe
    const next = location.search.split('next=')[1]; // identifie la prochaine page
    const navigate = useNavigate(); // permet de naviguer vers la prochaine page

    useEffect(() => { // Si authentification OK affiche la prochaine page prévue
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Log in to continue your job journey</h2>
                    </div>
                    <div>
                        {/*Par défaut isLoading est défini à "true"*/}
                        {isLoading ? (
                            <button className="auth-button animate-pulse">
                                <span>Signing you in</span>
                            </button>
                        ) : (
                            // Verifie si utilisateur est connecté
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button" onClick={auth.signOut}>
                                        <span>Log Out</span>
                                    </button>
                                ) : (
                                    <button className="auth-button" onClick={auth.signIn}>
                                        <span>Log In</span>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Auth;