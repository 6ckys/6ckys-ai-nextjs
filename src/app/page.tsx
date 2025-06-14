import {Sidebar} from './components/sidebar/Sidebar';
import {ChatContainer} from './components/chat/ChatContainer';

export default function Home() {
    return (
        <div className="h-screen bg-pro-bg-primary text-pro-text-primary flex overflow-hidden">
            <Sidebar/>
            <ChatContainer/>
        </div>
    );
}