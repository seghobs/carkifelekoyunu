let score = 0; // Kullanıcının toplam puanı
let username = '';
const scoreDisplay = document.getElementById('score');
const result = document.getElementById('result');
const segments = ['50', '100', 'Kaybettiniz', '200', 'Tekrar Çevir', 'Büyük Ödül'];
let isSpinning = false; // Çarkın dönme kontrolü
let currentRotation = 0; // Çarkın mevcut toplam dönüş açısı

// Liderlik tablosu
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Oyun başladığında formu gizle ve oyun alanını göster
document.getElementById('startGame').addEventListener('click', () => {
  username = document.getElementById('username').value;
  if (username) {
    document.getElementById('usernameForm').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
  } else {
    alert('Lütfen bir kullanıcı adı girin!');
  }
});

// Çarkı döndürme fonksiyonu
document.getElementById('spinButton').addEventListener('click', spinWheel);

function spinWheel() {
  if (isSpinning) return; // Çark dönüyorsa yeni bir döndürme işlemi engellenir
  isSpinning = true;

  const wheel = document.getElementById('wheel');

  // Yeni rastgele dönüş açısını hesapla
  const randomDegree = Math.floor(Math.random() * 360) + 720; // 2 tam tur + rastgele
  currentRotation += randomDegree; // Mevcut dönüş açısına ekle

  // Çarkı döndür
  wheel.style.transition = 'transform 3s ease-out'; // Her zaman aynı süre ve hız
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  // Sonucu hesapla
  setTimeout(() => {
    const finalDegree = currentRotation % 360; // Son pozisyon
    const segmentIndex = Math.floor((360 - finalDegree) / 60) % 6; // Göstergeye göre segment hesapla
    const selectedSegment = segments[segmentIndex];
    
    // Sonuç mesajı ve puan güncellemesi
    result.innerText = `Sonuç: ${selectedSegment}`;
    updateScore(selectedSegment);

    // Çark hazır olduğunda sıfırlama
    setTimeout(() => {
      isSpinning = false; // Yeniden döndürmeye izin ver
    }, 500);
  }, 3000); // Çark dönerken geçen süre
}

function updateScore(segment) {
  if (segment === 'Kaybettiniz') {
    score = 0; // Puan sıfırlanır
    gameOver(); // Oyun bitti
  } else if (segment === 'Tekrar Çevir') {
    // Puan değişmez
  } else if (segment === 'Büyük Ödül') {
    score += 500; // Büyük ödül puanı
  } else {
    score += parseInt(segment); // Segmentin puanını ekle
  }
  scoreDisplay.innerText = score; // Puanı güncelle
}

function gameOver() {
  // Oyun bittiğinde kullanıcıyı liderlik tablosuna kaydet
  leaderboard.push({ username, score });
  leaderboard.sort((a, b) => b.score - a.score); // En yüksek puanlıları öne al

  // En iyi 5 oyuncuyu kaydet
  leaderboard = leaderboard.slice(0, 5);

  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

  showLeaderboard();
}

function showLeaderboard() {
  document.getElementById('gameArea').style.display = 'none';
  document.getElementById('leaderboard').style.display = 'block';
  
  // Liderlik tablosunun animasyonla görünmesi için 'show' sınıfını ekle
  document.getElementById('leaderboard').classList.add('show');

  const leaderboardList = document.getElementById('leaderboardList');
  leaderboardList.innerHTML = ''; // Önceki listeyi temizle

  leaderboard.forEach(player => {
    const li = document.createElement('li');
    li.textContent = `${player.username} - ${player.score} Puan`;
    leaderboardList.appendChild(li);
  });
}
