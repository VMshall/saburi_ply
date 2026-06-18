# =====================================
# 1. HTTP → HTTPS + WWW
# =====================================
server {
    listen 80;
    listen [::]:80;
    server_name saburiply.com www.saburiply.com;

    return 301 https://www.saburiply.com$request_uri;
}

# =====================================
# 2. HTTPS non-www → www
# =====================================
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name saburiply.com;

    ssl_certificate /etc/letsencrypt/live/saburiply.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/saburiply.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://www.saburiply.com$request_uri;
}

# =====================================
# 3. MAIN SITE (WWW ONLY)
# =====================================
server {

    server_name www.saburiply.com;

    root /var/www/saburiply_client/dist/spa;
    index index.html;

    # SSL
    listen 443 ssl;
    listen [::]:443 ssl ipv6only=on;
    ssl_certificate /etc/letsencrypt/live/saburiply.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/saburiply.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # =====================================
    # Certbot Challenge
    # =====================================
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/html;
        allow all;
    }

    # =====================================
    # OLD URL → NEW URL (SEO REDIRECTS)
    # =====================================

    location = /marine-plywood-india.php {
        return 301 https://www.saburiply.com/products/marine-plywood-india;
    }

    location = /block-board-india.php {
        return 301 https://www.saburiply.com/products/block-board-india;
    }

    location = /flush-door-india.php {
        return 301 https://www.saburiply.com/products/flush-door-india;
    }

    location = /flexi-plywood-india.php {
        return 301 https://www.saburiply.com/products/flexi-plywood-india;
    }

    location = /shuttering-plywood-india.php {
        return 301 https://www.saburiply.com/products/shuttering-plywood-india;
    }

    location = /fire-retardant-india.php {
        return 301 https://www.saburiply.com/products/fire-retardant-india;
    }

    location = /saburi-board.php {
        return 301 https://www.saburiply.com/products/saburi-gold-blockboard;
    }

    location = /saburi-perennial.php {
        return 301 https://www.saburiply.com/products/saburi-perennial;
    }

    location = /saburi-club.php {
        return 301 https://www.saburiply.com/products/saburi-club-h-plus;
    }

    location = /saburi-door-frame.php {
        return 301 https://www.saburiply.com/products/saburi-smart-wpc-door-frames;
    }

    location = /saburi-h-plus.php {
        return 301 https://www.saburiply.com/products/saburi-club-h-plus;
    }

    location = /saburi-scout-plywood.php {
        return 301 https://www.saburiply.com/products/saburi-scout-plywood;
    }

    location = /modwud-particle-board.php {
        return 301 https://www.saburiply.com/products/saburi-modwud-plain;
    }

    location = /brw_plywood.php {
        return 301 https://www.saburiply.com/products/marine-plywood-india;
    }

    location = /block_board_gurjan.php {
        return 301 https://www.saburiply.com/products/block-board-india;
    }

    location = /block-board.php {
        return 301 https://www.saburiply.com/products/block-board-india;
    }

    location = /saburi-board {
        return 301 https://www.saburiply.com/products/saburi-gold-blockboard;
    }

    rewrite ^/best-plywood-.*\.php$ https://www.saburiply.com/products/marine-plywood-india permanent;

    # =====================================
    # NEW SEO REDIRECTS (Task 3)
    # =====================================
    location = /best-plywood-bangalore {
        return 301 https://www.saburiply.com/plywood-dealers-bangalore;
    }
    location = /blog/1 { return 301 https://www.saburiply.com/blog/top-7-stylish-panel-door-for-your-home-interiors; }
    location = /blog/2 { return 301 https://www.saburiply.com/blog/top-5-isi-certified-termite-proof-plywood-brands-in-india; }
    location = /blog/3 { return 301 https://www.saburiply.com/blog/advantages-of-best-boiling-water-proof-bwp-plywood-brand-in-india; }
    location = /blog/4 { return 301 https://www.saburiply.com/blog/top-7-trends-of-plywood-brand-in-india; }
    location = /blog/5 { return 301 https://www.saburiply.com/blog/top-10-plywood-manufacturers-in-india-leading-the-industry-with-quality-and-innovation; }

    # =====================================
    # BLOGS (Node / Backend)
    # =====================================
    location = /blogs {
        return 301 /blogs/;
    }

    location /blogs/ {
        proxy_pass http://127.0.0.1:9000/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto https;
    }

    # =====================================
    # ADMIN PANEL
    # =====================================
    location ^~ /saburi-panel-admin/ {
        alias /var/www/saburiply_admin/;
        try_files $uri $uri/ /saburi-panel-admin/index.html;
    }

    location = /saburi-panel-admin {
        return 301 /saburi-panel-admin/;
    }

    # =====================================
    # SPA fallback
    # =====================================
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static caching
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        expires 30d;
        access_log off;
    }
}

