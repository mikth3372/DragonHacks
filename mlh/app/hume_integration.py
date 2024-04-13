import asyncio
from hume import HumeStreamClient, StreamSocket
from hume.models.config import ProsodyConfig
from config import HUME_API_KEY

async def analyze_audio():
    client = HumeStreamClient(HUME_API_KEY)
    config = ProsodyConfig()
    async with client.connect([config]) as socket:
        result = await socket.send_file("path_to_your_audio_file.mp3")
        return result

async def main():
    result = await analyze_audio()
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
