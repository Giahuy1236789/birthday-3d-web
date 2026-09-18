const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const birthdayData = {
  // Đổi các giá trị trong file này để cá nhân hoá toàn bộ website.
  name: 'Mỹ Hợi',
  shortName: 'Mỹ Hợi',
  message: `Chúc bạn một tuổi mới thật nhiều niềm vui, luôn khỏe mạnh, hạnh phúc và gặp thật nhiều may mắn.

Mong rằng những điều bạn đang ấp ủ sẽ dần trở thành hiện thực.

Hy vọng mỗi ngày của tuổi mới đều có thêm một lý do để bạn mỉm cười.

Happy Birthday! 🎂✨`,
  music: publicAsset('/music/birthday.mp3'),
  memories: [
    publicAsset('/images/photo1.svg'),
    publicAsset('/images/photo2.svg'),
    publicAsset('/images/photo3.svg'),
    publicAsset('/images/photo4.svg'),
    publicAsset('/images/photo5.svg'),
    publicAsset('/images/photo6.svg'),
  ],
  memoryCaptions: [
    'Một chiều rực nắng',
    'Nụ cười thật xinh',
    'Những điều dịu dàng',
    'Chuyến đi nhỏ',
    'Một ngày bình yên',
    'Khoảnh khắc thuộc về chúng ta',
  ],
  timeline: [
    { icon: '✦', title: 'Lần đầu gặp nhau', text: 'Một kỷ niệm nhỏ, nhưng vẫn đủ khiến người ta nhớ mãi.' },
    { icon: '◌', title: 'Một ngày đáng nhớ', text: 'Có thật nhiều tiếng cười và những điều không cần nói thành lời.' },
    { icon: '✿', title: 'Một chuyến đi vui', text: 'Cất lại vài lát cắt đẹp của tuổi trẻ trong veo.' },
    { icon: '🎂', title: 'Và hôm nay', text: 'Là ngày cả thế giới có thêm một người thật đặc biệt.' },
  ],
  balloonMessages: [
    'Luôn vui vẻ nhé ❤️',
    'Tuổi mới thật nhiều may mắn ✨',
    'Luôn xinh đẹp và hạnh phúc 🌷',
    'Mọi điều tốt đẹp sẽ đến 🌟',
    'Cứ rực rỡ theo cách của bạn nhé!',
  ],
}
