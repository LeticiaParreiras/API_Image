import { NavBar } from "../components/NavBar";
import PostFeed from "../components/PostFeed";


const Home = () => {

    return(
        <main className='
 min-h-screen w-full flex'>
        <NavBar/>
        <PostFeed type="recent" />
        </main>
    )
}

export default Home;