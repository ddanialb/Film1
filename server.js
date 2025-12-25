import express from "express";
import https from "https";
import http from "http";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Player</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        
        :root{
            --primary:#6366f1;
            --secondary:#8b5cf6;
            --bg:#0a0a0f;
            --card:rgba(20,20,30,0.9);
            --border:rgba(255,255,255,0.08);
            --text:#f1f1f1;
            --muted:#888;
        }
        
        body{
            font-family:system-ui,-apple-system,sans-serif;
            background:var(--bg);
            min-height:100vh;
            display:flex;
            justify-content:center;
            align-items:center;
            padding:15px;
        }
        
        .container{
            background:var(--card);
            padding:30px;
            border-radius:20px;
            width:100%;
            max-width:800px;
            border:1px solid var(--border);
        }
        
        .header{
            text-align:center;
            margin-bottom:25px;
        }
        
        .logo{
            width:60px;
            height:60px;
            background:linear-gradient(135deg,var(--primary),var(--secondary));
            border-radius:16px;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            font-size:28px;
            margin-bottom:12px;
        }
        
        h1{
            color:var(--text);
            font-size:28px;
            font-weight:700;
        }
        
        .input-group{
            display:flex;
            gap:10px;
            margin-bottom:20px;
        }
        
        input{
            flex:1;
            padding:15px 18px;
            border:2px solid var(--border);
            border-radius:12px;
            background:rgba(0,0,0,0.3);
            color:var(--text);
            font-size:15px;
            outline:none;
            transition:border-color 0.2s;
        }
        
        input:focus{
            border-color:var(--primary);
        }
        
        input::placeholder{
            color:var(--muted);
        }
        
        .btn{
            padding:15px 30px;
            background:linear-gradient(135deg,var(--primary),var(--secondary));
            color:#fff;
            border:none;
            border-radius:12px;
            cursor:pointer;
            font-size:15px;
            font-weight:600;
            transition:transform 0.2s,opacity 0.2s;
        }
        
        .btn:hover{
            transform:translateY(-2px);
        }
        
        .btn:disabled{
            opacity:0.5;
            cursor:not-allowed;
            transform:none;
        }
        
        .loader{
            display:none;
            justify-content:center;
            padding:40px;
        }
        
        .loader.show{
            display:flex;
        }
        
        .spinner{
            width:45px;
            height:45px;
            border:3px solid var(--border);
            border-top-color:var(--primary);
            border-radius:50%;
            animation:spin 0.8s linear infinite;
        }
        
        @keyframes spin{to{transform:rotate(360deg)}}
        
        .video-container{
            display:none;
            border-radius:16px;
            overflow:hidden;
            background:#000;
        }
        
        .video-container.show{
            display:block;
        }
        
        video{
            width:100%;
            display:block;
        }
        
        .status{
            text-align:center;
            font-size:14px;
            margin-top:15px;
            padding:10px;
            border-radius:8px;
        }
        
        .status:empty{display:none}
        .status.error{background:rgba(239,68,68,0.1);color:#f87171}
        .status.success{background:rgba(34,197,94,0.1);color:#4ade80}
        .status.loading{background:rgba(234,179,8,0.1);color:#facc15}
        
        .features{
            display:grid;
            grid-template-columns:repeat(4,1fr);
            gap:10px;
            margin-top:25px;
        }
        
        .feature{
            background:rgba(255,255,255,0.03);
            border:1px solid var(--border);
            border-radius:10px;
            padding:15px;
            text-align:center;
        }
        
        .feature-icon{font-size:24px;margin-bottom:6px;display:block}
        .feature-text{color:var(--muted);font-size:12px}
        
        .footer{
            margin-top:25px;
            text-align:center;
            padding-top:20px;
            border-top:1px solid var(--border);
        }
        
        .credit{
            display:inline-flex;
            align-items:center;
            gap:8px;
            color:var(--text);
            font-size:14px;
        }
        
        .credit-name{
            background:linear-gradient(135deg,#a78bfa,#60a5fa);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            background-clip:text;
            font-weight:700;
        }

        /* === MOBILE === */
        @media(max-width:768px){
            .container{padding:20px}
            .input-group{flex-direction:column}
            .btn{width:100%}
            .features{grid-template-columns:repeat(2,1fr)}
            .logo{width:50px;height:50px;font-size:24px}
            h1{font-size:24px}
        }
        
        /* === DESKTOP === */
        @media(min-width:769px) and (max-width:1920px){
            .container{max-width:900px;padding:40px}
        }
        
        /* === TV === */
        @media(min-width:1921px){
            body{padding:50px}
            .container{max-width:1400px;padding:60px;border-radius:30px}
            .logo{width:100px;height:100px;font-size:50px;border-radius:24px}
            h1{font-size:48px}
            input{padding:25px 30px;font-size:22px;border-radius:18px}
            .btn{padding:25px 50px;font-size:22px;border-radius:18px}
            .features{gap:20px;margin-top:40px}
            .feature{padding:30px;border-radius:16px}
            .feature-icon{font-size:40px;margin-bottom:12px}
            .feature-text{font-size:18px}
            .footer{margin-top:40px;padding-top:30px}
            .credit{font-size:22px;gap:12px}
            .video-container{border-radius:24px}
            .status{font-size:20px;padding:18px;border-radius:14px;margin-top:25px}
            .spinner{width:70px;height:70px;border-width:5px}
            .loader{padding:60px}
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="logo">▶️</div>
            <h1>Player</h1>
        </header>
        
        <div class="input-group">
            <input type="text" id="url" placeholder="لینک ویدیو را وارد کنید...">
            <button class="btn" id="btn">▶ پخش</button>
        </div>

        <div class="loader" id="loader">
            <div class="spinner"></div>
        </div>

        <div class="video-container" id="player">
            <video id="video" controls playsinline></video>
        </div>

        <div class="status" id="status"></div>
        
        <div class="features">
            <div class="feature">
                <span class="feature-icon">⚡</span>
                <span class="feature-text">سریع</span>
            </div>
            <div class="feature">
                <span class="feature-icon">🎬</span>
                <span class="feature-text">کیفیت بالا</span>
            </div>
            <div class="feature">
                <span class="feature-icon">📱</span>
                <span class="feature-text">همه دستگاه‌ها</span>
            </div>
            <div class="feature">
                <span class="feature-icon">🔒</span>
                <span class="feature-text">امن</span>
            </div>
        </div>
        
        <footer class="footer">
            <div class="credit">
                <span>💜</span>
                <span>توسط</span>
                <span class="credit-name">آقادنی</span>
            </div>
        </footer>
    </div>

    <script>
        const $ = id => document.getElementById(id);
        const url = $('url'), btn = $('btn'), loader = $('loader'), player = $('player'), video = $('video'), status = $('status');

        const setStatus = (msg, type) => { status.textContent = msg; status.className = 'status ' + type; };

        btn.onclick = () => {
            const link = url.value.trim();
            if (!link) return setStatus('لینک را وارد کنید', 'error');
            
            btn.disabled = true;
            loader.classList.add('show');
            player.classList.remove('show');
            setStatus('در حال بارگذاری...', 'loading');

            video.src = '/stream?url=' + encodeURIComponent(link);
            
            video.onloadeddata = () => {
                loader.classList.remove('show');
                player.classList.add('show');
                setStatus('آماده پخش ✓', 'success');
                btn.disabled = false;
                video.play().catch(() => {});
            };
            
            video.onerror = () => {
                loader.classList.remove('show');
                setStatus('خطا در بارگذاری', 'error');
                btn.disabled = false;
            };
        };

        url.onkeypress = e => { if (e.key === 'Enter') btn.click(); };
    </script>
</body>
</html>
  `);
});

app.get("/stream", (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("URL required");

  const protocol = url.startsWith("https") ? https : http;
  const options = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  };

  if (req.headers.range) options.headers.Range = req.headers.range;

  const request = protocol
    .get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return res.redirect(
          "/stream?url=" + encodeURIComponent(response.headers.location)
        );
      }

      const headers = {
        "Content-Type": response.headers["content-type"] || "video/mp4",
        "Accept-Ranges": "bytes",
      };

      if (response.headers["content-length"])
        headers["Content-Length"] = response.headers["content-length"];
      if (response.headers["content-range"])
        headers["Content-Range"] = response.headers["content-range"];

      res.writeHead(response.statusCode, headers);
      response.pipe(res);
      req.on("close", () => response.destroy());
    })
    .on("error", (err) => {
      console.error("Stream error:", err.message);
      if (!res.headersSent) res.status(500).send("Error");
    });

  request.setTimeout(30000, () => {
    request.destroy();
    if (!res.headersSent) res.status(504).send("Timeout");
  });
});

app.listen(PORT, () => console.log("🚀 Server running on port " + PORT));
