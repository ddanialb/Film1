import express from "express";
import https from "https";
import http from "http";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// صفحه اصلی
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ویدیو پلیر</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, sans-serif;
            background: #0a0a0a;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            background: linear-gradient(145deg, #1a1a1a, #0f0f0f);
            padding: 35px;
            border-radius: 20px;
            width: 100%;
            max-width: 900px;
            border: 1px solid #2a2a2a;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
        }
        
        h1 {
            color: #fff;
            text-align: center;
            margin-bottom: 30px;
            font-weight: 600;
            font-size: 28px;
            background: linear-gradient(90deg, #e50914, #ff6b6b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 25px;
        }
        
        input {
            flex: 1;
            padding: 16px 20px;
            border: 2px solid #2a2a2a;
            border-radius: 12px;
            background: #151515;
            color: #fff;
            font-size: 15px;
            outline: none;
            transition: all 0.3s;
        }
        
        input:focus {
            border-color: #e50914;
            box-shadow: 0 0 20px rgba(229,9,20,0.2);
        }
        
        input::placeholder {
            color: #555;
        }
        
        button {
            padding: 16px 35px;
            background: linear-gradient(135deg, #e50914, #b20710);
            color: #fff;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            transition: all 0.3s;
            white-space: nowrap;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(229,9,20,0.4);
        }
        
        button:disabled {
            background: #333;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        
        .video-container {
            display: none;
            border-radius: 16px;
            overflow: hidden;
            background: #000;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        
        .video-container.show {
            display: block;
        }
        
        video {
            width: 100%;
            display: block;
        }
        
        .status {
            color: #666;
            text-align: center;
            font-size: 14px;
            margin-top: 20px;
            min-height: 20px;
        }
        
        .status.error {
            color: #e50914;
        }
        
        .status.success {
            color: #46d369;
        }
        
        .status.loading {
            color: #ffa500;
        }

        .loader {
            display: none;
            justify-content: center;
            align-items: center;
            padding: 40px;
        }
        
        .loader.show {
            display: flex;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #222;
            border-top-color: #e50914;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .info {
            background: #1a1a1a;
            border: 1px solid #2a2a2a;
            border-radius: 12px;
            padding: 15px 20px;
            margin-top: 20px;
            color: #888;
            font-size: 13px;
            text-align: center;
        }

        @media (max-width: 600px) {
            .input-group {
                flex-direction: column;
            }
            button {
                width: 100%;
            }
            .container {
                padding: 25px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 ویدیو پلیر</h1>
        
        <div class="input-group">
            <input type="text" id="url" placeholder="لینک ویدیو را اینجا وارد کنید...">
            <button id="btn">پخش</button>
        </div>

        <div class="loader" id="loader">
            <div class="spinner"></div>
        </div>

        <div class="video-container" id="player">
            <video id="video" controls></video>
        </div>

        <p class="status" id="status"></p>
        
        <div class="info">
            💡 ویدیو مستقیم استریم میشه - نیازی به دانلود کامل نیست
        </div>
    </div>

    <script>
        const urlInput = document.getElementById('url');
        const btn = document.getElementById('btn');
        const loader = document.getElementById('loader');
        const player = document.getElementById('player');
        const video = document.getElementById('video');
        const status = document.getElementById('status');

        btn.onclick = () => {
            const url = urlInput.value.trim();
            
            if (!url) {
                status.textContent = 'لطفاً لینک را وارد کنید';
                status.className = 'status error';
                return;
            }

            btn.disabled = true;
            btn.textContent = 'صبر کنید...';
            loader.classList.add('show');
            player.classList.remove('show');
            status.textContent = 'در حال بارگذاری...';
            status.className = 'status loading';

            // ساخت لینک استریم
            const streamUrl = '/stream?url=' + encodeURIComponent(url);
            
            video.src = streamUrl;
            
            video.onloadeddata = () => {
                loader.classList.remove('show');
                player.classList.add('show');
                status.textContent = 'آماده پخش ✓';
                status.className = 'status success';
                btn.disabled = false;
                btn.textContent = 'پخش';
                video.play();
            };
            
            video.onerror = () => {
                loader.classList.remove('show');
                status.textContent = 'خطا در بارگذاری ویدیو';
                status.className = 'status error';
                btn.disabled = false;
                btn.textContent = 'پخش';
            };
        };

        urlInput.onkeypress = (e) => {
            if (e.key === 'Enter') btn.click();
        };
    </script>
</body>
</html>
    `);
});

// استریم مستقیم ویدیو (بدون ذخیره در RAM)
app.get("/stream", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("URL required");
  }

  const protocol = url.startsWith("https") ? https : http;

  // ساخت headers برای درخواست
  const options = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  };

  // اگه Range header داشت (برای seek کردن)
  if (req.headers.range) {
    options.headers.Range = req.headers.range;
  }

  const request = protocol
    .get(url, options, (response) => {
      // اگه redirect بود
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        return res.redirect("/stream?url=" + encodeURIComponent(redirectUrl));
      }

      // کپی headers از سرور اصلی
      const headers = {
        "Content-Type": response.headers["content-type"] || "video/mp4",
        "Accept-Ranges": "bytes",
      };

      if (response.headers["content-length"]) {
        headers["Content-Length"] = response.headers["content-length"];
      }

      if (response.headers["content-range"]) {
        headers["Content-Range"] = response.headers["content-range"];
      }

      // ارسال status code
      res.writeHead(response.statusCode, headers);

      // پایپ مستقیم به کلاینت (بدون ذخیره در RAM)
      response.pipe(res);

      // اگه کاربر قطع کرد
      req.on("close", () => {
        response.destroy();
      });
    })
    .on("error", (err) => {
      console.error("Stream error:", err.message);
      if (!res.headersSent) {
        res.status(500).send("Error streaming video");
      }
    });

  request.setTimeout(30000, () => {
    request.destroy();
    if (!res.headersSent) {
      res.status(504).send("Timeout");
    }
  });
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
