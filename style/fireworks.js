// Dán toàn bộ nội dung này vào file style/fireworks.js
(function (window) {
  var Fireworks = function (canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.running = false;
    this.resize();
    window.addEventListener("resize", this.resize.bind(this));
  };

  Fireworks.prototype.resize = function () {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  Fireworks.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this.animate();
  };

  Fireworks.prototype.stop = function () {
    this.running = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Fireworks.prototype.animate = function () {
    if (!this.running) return;
    requestAnimationFrame(this.animate.bind(this));

    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalCompositeOperation = "lighter";

    if (Math.random() < 0.3) {
      // Tăng/giảm số này để chỉnh mật độ pháo
      this.launch();
    }

    for (var i = this.particles.length - 1; i >= 0; i--) {
      var p = this.particles[i];
      p.update();
      p.draw(this.ctx);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  };

  Fireworks.prototype.launch = function () {
    var x = Math.random() * this.canvas.width;
    var y = this.canvas.height;
    var targetY = Math.random() * (this.canvas.height / 2);
    var color = "hsl(" + Math.random() * 360 + ", 100%, 50%)";

    // Tạo hạt pháo hoa bay lên
    for (var i = 0; i < 30; i++) {
      // Số lượng hạt mỗi lần nổ
      this.particles.push(new Particle(x, y, targetY, color));
    }
  };

  var Particle = function (x, y, targetY, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    // Bắn toả ra xung quanh
    var angle = Math.random() * Math.PI * 2;
    var speed = Math.random() * 5 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 5; // -5 để bắn lên trên
    this.life = 100;
    this.gravity = 0.1;
  };

  Particle.prototype.update = function () {
    this.vx *= 0.95; // Ma sát không khí
    this.vy *= 0.95;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 1;
  };

  Particle.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
  };

  window.Fireworks = Fireworks; // Đưa biến ra toàn cục để index.html gọi được
})(window);
