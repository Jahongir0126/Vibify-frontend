import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Button, Tabs, Tab, Modal } from 'react-bootstrap';
import { FaCrown, FaMedal, FaTrophy, FaGem, FaLock, FaFire, FaCheck, FaSmile } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import ChallengeHeader from '../../components/ChallangeHeader/ChallengeHeader';
import ChallengeTabs from '../../components/ChallangeTabs/ChallengeTabs';
import ChallengeCard from '../../components/ChallangeCard/ChallengeCard';
import './Challenges.scss';

const Challenges = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('daily');
  const [theme, setTheme] = useState('light');
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [userSubscription, setUserSubscription] = useState('free');
  const [userEmojis, setUserEmojis] = useState(['😊', '👍', '❤️', '🎉']);
  const [userBadges, setUserBadges] = useState([
    { id: 1, name: 'Новичок', icon: <FaMedal className="badge-icon bronze" />, owned: true },
  ]);

  const challenges = {
    daily: [
      {
        id: 1,
        title: 'Daily Challenge 1',
        description: 'Complete 5 tasks today',
        progress: 60,
        reward: '100 XP',
        difficulty: 'easy',
        type: 'daily',
        isLocked: false
      },
      {
        id: 2,
        title: 'Daily Challenge 2',
        description: 'Complete 10 tasks today',
        progress: 30,
        reward: '200 XP',
        difficulty: 'medium',
        type: 'daily',
        isLocked: false
      }
    ],
    weekly: [
      {
        id: 3,
        title: 'Weekly Challenge 1',
        description: 'Complete 50 tasks this week',
        progress: 40,
        reward: '500 XP',
        difficulty: 'medium',
        type: 'weekly',
        isLocked: false
      }
    ],
    monthly: [
      {
        id: 4,
        title: 'Monthly Challenge 1',
        description: 'Complete 200 tasks this month',
        progress: 25,
        reward: '2000 XP',
        difficulty: 'hard',
        type: 'monthly',
        isLocked: false
      }
    ],
    premium: [
      {
        id: 5,
        title: 'Premium Challenge 1',
        description: 'Complete special premium tasks',
        progress: 0,
        reward: 'Premium Badge',
        difficulty: 'premium',
        type: 'premium',
        isLocked: true
      }
    ]
  };

  const rewards = [
    {
      id: 1,
      title: 'Bronze Badge',
      description: 'Complete 10 daily challenges',
      reward: '1000 XP',
      isOwned: true,
      isLocked: false
    },
    {
      id: 2,
      title: 'Silver Badge',
      description: 'Complete 25 daily challenges',
      reward: '2500 XP',
      isOwned: false,
      isLocked: false
    },
    {
      id: 3,
      title: 'Gold Badge',
      description: 'Complete 50 daily challenges',
      reward: '5000 XP',
      isOwned: false,
      isLocked: true
    }
  ];

  const badges = [
    { id: 1, name: 'Новичок', description: 'Завершите свой первый челлендж', icon: <FaMedal className="badge-icon bronze" />, owned: true },
    { id: 2, name: 'Энтузиаст', description: 'Завершите 5 челленджей', icon: <FaMedal className="badge-icon silver" />, owned: false },
    { id: 3, name: 'Мастер', description: 'Завершите 10 челленджей', icon: <FaMedal className="badge-icon gold" />, owned: false },
    { id: 4, name: 'Легенда', description: 'Завершите все ежемесячные челленджи подряд', icon: <FaTrophy className="badge-icon platinum" />, owned: false },
    { id: 5, name: 'VIP', description: 'Активируйте Premium подписку', icon: <FaCrown className="badge-icon premium" />, owned: userSubscription === 'premium' }
  ];

  const avatars = [
    {
      id: 1,
      name: 'Стандартный',
      imageUrl: 'https://i.pravatar.cc/100?img=1',
      owned: true
    },
    {
      id: 2,
      name: 'Искатель',
      imageUrl: 'https://i.pravatar.cc/100?img=2',
      owned: false
    },
    {
      id: 3,
      name: 'Чемпион',
      imageUrl: 'https://i.pravatar.cc/100?img=3',
      owned: false
    },
    {
      id: 4,
      name: 'Мистик',
      imageUrl: 'https://i.pravatar.cc/100?img=4',
      premium: true,
      owned: userSubscription === 'premium'
    }
  ];

  const emojis = [
    { id: 1, name: 'Базовые', stickers: ['😊', '👍', '❤️', '🎉', '🔥', '👏'], owned: true },
    { id: 2, name: 'Животные', stickers: ['🐶', '🐱', '🐼', '🦊', '🦁', '🐯'], owned: false },
    { id: 3, name: 'Еда', stickers: ['🍕', '🍦', '🍰', '🍩', '🍫', '🍎'], owned: false },
    { id: 4, name: 'VIP', stickers: ['💎', '👑', '🏆', '✨', '🌟', '💫'], premium: true, owned: userSubscription === 'premium' }
  ];

  const subscriptions = [
    {
      id: 1,
      name: 'Free',
      price: 'Бесплатно',
      features: [
        'Доступ к базовым челленджам',
        'Базовые стикеры',
        'Стандартный аватар'
      ],
      current: userSubscription === 'free'
    },
    {
      id: 2,
      name: 'Premium',
      price: '299₽/месяц',
      features: [
        'Доступ ко всем челленджам',
        'Эксклюзивные стикеры',
        'Премиум аватары',
        'Золотые нашивки',
        'VIP статус в профиле'
      ],
      current: userSubscription === 'premium'
    }
  ];

  const handleUpgradeSubscription = () => {
    // Здесь будет логика обновления подписки
    setUserSubscription('premium');
  };

  const handleClaimReward = () => {
    // Здесь будет логика получения награды
    setShowRewardModal(false);

    // Пример: Добавление нового эмодзи при получении награды
    if (selectedReward.id === 1) {
      setUserEmojis([...userEmojis, '🔥']);
    }
    // Пример: Добавление нашивки
    else if (selectedReward.id === 2) {
      const newBadge = badges.find(badge => badge.id === 2);
      if (newBadge && !userBadges.some(b => b.id === newBadge.id)) {
        setUserBadges([...userBadges, newBadge]);
      }
    }
  };

  useEffect(() => {
    // Проверка загрузки изображений аватаров
    const checkImages = () => {
      avatars.forEach(avatar => {
        const img = new Image();
        img.onerror = () => {
          console.error(`Не удалось загрузить изображение для аватара: ${avatar.name}`);
        };
        img.src = avatar.imageUrl;
      });
    };

    checkImages();
  }, []);

  return (
    <div className={`challenges-page ${theme}`}>
      <ChallengeHeader theme={theme} />

      <ChallengeTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
      />

      <div className="challenges-container">
        {challenges[activeTab].map(challenge => (
          <ChallengeCard
            key={challenge.id}
            {...challenge}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
};

export default Challenges;
