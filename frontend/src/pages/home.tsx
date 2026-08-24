import NiceModal from "@ebay/nice-modal-react";
import PostFeed from "../components/PostFeed";
import { CreatePostModal } from "../components/CreatePostModal";

const Home = () => {

    return(
        <div className='min-h-screen w-full bg-neutral-950 text-neutral-100 flex'>
            <button onClick={() => NiceModal.show(CreatePostModal)}>Novo post</button>
        <PostFeed type="recent" />
        </div>
    )
}

export default Home;