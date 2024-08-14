FROM python:3.11
RUN mkdir /app 
WORKDIR /app
EXPOSE 5001
COPY . .
ENV PYTHONPATH "${PYTHONPATH}:/app"
RUN pip install --no-cache-dir --progress-bar off -r requirements.txt 
ENTRYPOINT ["python", "-m", "src.chat_ui.main"]