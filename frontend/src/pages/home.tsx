import NiceModal from "@ebay/nice-modal-react";
import PostFeed from "../components/PostFeed";
import { CreatePostModal } from "../components/CreatePostModal";
import { Button } from "../shared/Button";
import { ButtonToggleTheme } from "../components/ButtonToggleTheme";

const Home = () => {

    return(
        <div className='min-h-screen w-full flex'>
            <Button variant={"ghost"}onClick={() => NiceModal.show(CreatePostModal)}>Novo post</Button>
            <ButtonToggleTheme/>
        <PostFeed type="recent" />
        </div>
    )
}

export default Home;