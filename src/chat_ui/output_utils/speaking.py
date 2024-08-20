import os
import pyaudio
from openai import OpenAI
import yaml


def speak_the_answer(answer: str) -> None:
    with open(
        os.getenv("CONFIG_FP"),
        "r",
    ) as file:
        config = yaml.safe_load(file)
        os.environ["HOST_URL"] = config["host_url"]
    if config["speak_the_answer"]:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        p = pyaudio.PyAudio()
        stream = p.open(format=8, channels=1, rate=24_000, output=True)
        with client.audio.speech.with_streaming_response.create(
            model="tts-1",
            voice="alloy",
            input=answer,
            response_format="pcm",
        ) as response:
            for chunk in response.iter_bytes(1024):
                stream.write(chunk)
                if os.getenv("STOP_SPEAKING") == "True":
                    break
