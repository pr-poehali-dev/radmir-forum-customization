import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Comment {
  id: number;
  topicId: number;
  author: string;
  content: string;
  createdAt: Date;
}

interface Topic {
  id: number;
  title: string;
  content: string;
  author: string;
  replies: number;
  views: number;
  isOpen: boolean;
  isPinned: boolean;
  createdAt: Date;
}

interface ForumSettings {
  accentColor: string;
  allowNewTopics: boolean;
  requireAuth: boolean;
}

interface RegisteredUser {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  registeredAt: Date;
  isOnline?: boolean;
  lastActivity?: Date;
}

export default function Index() {
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([
    {
      username: 'admin',
      password: 'admin',
      email: 'admin@radmir.rp',
      isAdmin: true,
      registeredAt: new Date('2025-01-01'),
      isOnline: true,
      lastActivity: new Date()
    }
  ]);

  const [onlineUsers, setOnlineUsers] = useState<number>(1);
  const [showUsersDialog, setShowUsersDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ newUsername: '', newPassword: '', confirmPassword: '' });

  const [topics, setTopics] = useState<Topic[]>([
    {
      id: 1,
      title: 'Правила форума Radmir RP',
      content: 'Добро пожаловать на форум Radmir RP! Здесь вы можете обсуждать игровые моменты...',
      author: 'admin',
      replies: 2,
      views: 1203,
      isOpen: true,
      isPinned: true,
      createdAt: new Date('2025-01-15')
    },
    {
      id: 2,
      title: 'Где найти лучшую работу?',
      content: 'Подскажите, какая работа самая прибыльная на сервере?',
      author: 'Player123',
      replies: 1,
      views: 567,
      isOpen: true,
      isPinned: false,
      createdAt: new Date('2025-10-18')
    },
    {
      id: 3,
      title: 'Обновление 2.0 - что нового?',
      content: 'Обсуждаем новое обновление сервера',
      author: 'Moderator',
      replies: 0,
      views: 2341,
      isOpen: false,
      isPinned: true,
      createdAt: new Date('2025-10-10')
    }
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      topicId: 1,
      author: 'admin',
      content: 'Не забывайте соблюдать правила!',
      createdAt: new Date('2025-01-15')
    },
    {
      id: 2,
      topicId: 1,
      author: 'Player123',
      content: 'Понятно, спасибо!',
      createdAt: new Date('2025-01-16')
    },
    {
      id: 3,
      topicId: 2,
      author: 'Moderator',
      content: 'Советую попробовать работу таксиста',
      createdAt: new Date('2025-10-18')
    }
  ]);

  const [forumSettings, setForumSettings] = useState<ForumSettings>({
    accentColor: '#00ff88',
    allowNewTopics: true,
    requireAuth: true
  });

  const [newTopic, setNewTopic] = useState({ title: '', content: '' });
  const [showNewTopicDialog, setShowNewTopicDialog] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', email: '' });
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleRegister = () => {
    if (!registerForm.username || !registerForm.password || !registerForm.email) {
      toast.error('Заполните все поля');
      return;
    }

    if (registeredUsers.find(u => u.username.toLowerCase() === registerForm.username.toLowerCase())) {
      toast.error('Пользователь с таким именем уже существует');
      return;
    }

    const newUser: RegisteredUser = {
      username: registerForm.username,
      password: registerForm.password,
      email: registerForm.email,
      isAdmin: false,
      registeredAt: new Date()
    };

    setRegisteredUsers([...registeredUsers, newUser]);
    toast.success('Регистрация успешна! Теперь войдите в систему');
    setRegisterForm({ username: '', password: '', email: '' });
    setShowRegisterDialog(false);
    setShowLoginDialog(true);
  };

  const handleLogin = () => {
    if (!loginForm.username || !loginForm.password) {
      toast.error('Заполните все поля');
      return;
    }

    const foundUser = registeredUsers.find(
      u => u.username.toLowerCase() === loginForm.username.toLowerCase() && u.password === loginForm.password
    );

    if (!foundUser) {
      toast.error('Неверный логин или пароль');
      return;
    }

    setUser({ username: foundUser.username, isAdmin: foundUser.isAdmin });
    setRegisteredUsers(registeredUsers.map(u => 
      u.username === foundUser.username 
        ? { ...u, isOnline: true, lastActivity: new Date() }
        : u
    ));
    toast.success(`Добро пожаловать, ${foundUser.username}!`);
    setLoginForm({ username: '', password: '' });
    setShowLoginDialog(false);
  };

  const handleUpdateProfile = () => {
    if (!user) return;

    if (settingsForm.newPassword && settingsForm.newPassword !== settingsForm.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (settingsForm.newUsername && settingsForm.newUsername !== user.username) {
      if (registeredUsers.find(u => u.username.toLowerCase() === settingsForm.newUsername.toLowerCase())) {
        toast.error('Пользователь с таким именем уже существует');
        return;
      }
    }

    const oldUsername = user.username;
    const newUsername = settingsForm.newUsername || user.username;
    const newPassword = settingsForm.newPassword || registeredUsers.find(u => u.username === user.username)?.password || '';

    setRegisteredUsers(registeredUsers.map(u => 
      u.username === oldUsername
        ? { ...u, username: newUsername, password: newPassword }
        : u
    ));

    setTopics(topics.map(t => 
      t.author === oldUsername
        ? { ...t, author: newUsername }
        : t
    ));

    setComments(comments.map(c => 
      c.author === oldUsername
        ? { ...c, author: newUsername }
        : c
    ));

    setUser({ username: newUsername, isAdmin: user.isAdmin });
    setSettingsForm({ newUsername: '', newPassword: '', confirmPassword: '' });
    setShowSettingsDialog(false);
    toast.success('Профиль обновлен!');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 5) + registeredUsers.filter(u => u.isOnline).length);
    }, 5000);

    return () => clearInterval(interval);
  }, [registeredUsers]);

  useEffect(() => {
    if (user) {
      const activityInterval = setInterval(() => {
        setRegisteredUsers(registeredUsers.map(u => 
          u.username === user.username 
            ? { ...u, lastActivity: new Date() }
            : u
        ));
      }, 30000);

      return () => clearInterval(activityInterval);
    }
  }, [user, registeredUsers]);

  const handleCreateTopic = () => {
    if (!user) {
      toast.error('Войдите в аккаунт');
      return;
    }

    if (!newTopic.title || !newTopic.content) {
      toast.error('Заполните все поля');
      return;
    }

    const topic: Topic = {
      id: topics.length + 1,
      title: newTopic.title,
      content: newTopic.content,
      author: user.username,
      replies: 0,
      views: 0,
      isOpen: true,
      isPinned: false,
      createdAt: new Date()
    };

    setTopics([topic, ...topics]);
    setNewTopic({ title: '', content: '' });
    setShowNewTopicDialog(false);
    toast.success('Тема создана!');
  };

  const handleAddComment = (topicId: number) => {
    if (!user) {
      toast.error('Войдите в аккаунт');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Напишите комментарий');
      return;
    }

    const comment: Comment = {
      id: comments.length + 1,
      topicId,
      author: user.username,
      content: newComment,
      createdAt: new Date()
    };

    setComments([...comments, comment]);
    setTopics(topics.map(t => t.id === topicId ? { ...t, replies: t.replies + 1 } : t));
    setNewComment('');
    toast.success('Комментарий добавлен!');
  };

  const deleteComment = (commentId: number) => {
    if (!user?.isAdmin) {
      toast.error('Только админы могут удалять комментарии');
      return;
    }

    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setComments(comments.filter(c => c.id !== commentId));
      setTopics(topics.map(t => t.id === comment.topicId ? { ...t, replies: Math.max(0, t.replies - 1) } : t));
      toast.success('Комментарий удален');
    }
  };

  const toggleTopicStatus = (id: number) => {
    if (!user?.isAdmin) {
      toast.error('Только админы могут менять статус тем');
      return;
    }

    setTopics(topics.map(topic => 
      topic.id === id ? { ...topic, isOpen: !topic.isOpen } : topic
    ));
    toast.success('Статус темы изменен');
  };

  const deleteTopic = (id: number) => {
    if (!user?.isAdmin) {
      toast.error('Только админы могут удалять темы');
      return;
    }

    setTopics(topics.filter(topic => topic.id !== id));
    setComments(comments.filter(comment => comment.topicId !== id));
    toast.success('Тема удалена');
  };

  const togglePinTopic = (id: number) => {
    if (!user?.isAdmin) {
      toast.error('Только админы могут закреплять темы');
      return;
    }

    setTopics(topics.map(topic => 
      topic.id === id ? { ...topic, isPinned: !topic.isPinned } : topic
    ));
    toast.success('Статус закрепления изменен');
  };

  const openTopicDialog = (topic: Topic) => {
    setSelectedTopic(topic);
    setTopics(topics.map(t => t.id === topic.id ? { ...t, views: t.views + 1 } : t));
  };

  const pinnedTopics = topics.filter(t => t.isPinned).sort((a, b) => b.id - a.id);
  const regularTopics = topics.filter(t => !t.isPinned).sort((a, b) => b.id - a.id);
  const sortedTopics = [...pinnedTopics, ...regularTopics];

  const topicComments = selectedTopic ? comments.filter(c => c.topicId === selectedTopic.id).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()) : [];

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <Card className="bg-card/50 border-primary/30 neon-border">
                <CardContent className="py-2 px-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-semibold" style={{ color: forumSettings.accentColor }}>
                    {onlineUsers} онлайн
                  </span>
                </CardContent>
              </Card>

              <Dialog open={showUsersDialog} onOpenChange={setShowUsersDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-border neon-border-blue">
                    <Icon name="Users" className="mr-2" size={18} />
                    Пользователи ({registeredUsers.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border neon-border max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl" style={{ color: forumSettings.accentColor }}>Пользователи форума</DialogTitle>
                    <DialogDescription>Список всех зарегистрированных пользователей</DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="max-h-[400px] pr-4">
                    <div className="space-y-2">
                      {registeredUsers.map((regUser) => (
                        <Card key={regUser.username} className="bg-muted/30 border-border">
                          <CardContent className="py-3 px-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center neon-border" style={{ backgroundColor: forumSettings.accentColor + '20' }}>
                                  <Icon name="User" size={18} style={{ color: forumSettings.accentColor }} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold">{regUser.username}</p>
                                    {regUser.isOnline && (
                                      <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-xs text-primary">онлайн</span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Регистрация: {regUser.registeredAt.toLocaleDateString('ru-RU')}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                {regUser.isAdmin && (
                                  <Badge className="bg-accent text-accent-foreground">Admin</Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-2 neon-glow" style={{ color: forumSettings.accentColor }}>
                CAPITAL RP FORUM
              </h1>
              <p className="text-muted-foreground">Игровое сообщество | Обсуждения | Новости</p>
            </div>
            
            {!user ? (
              <div className="flex gap-2">
                <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                  <DialogTrigger asChild>
                    <Button className="neon-border" style={{ backgroundColor: forumSettings.accentColor, color: '#0a0a0f' }}>
                      <Icon name="LogIn" className="mr-2" size={18} />
                      Войти
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border neon-border">
                    <DialogHeader>
                      <DialogTitle className="text-2xl" style={{ color: forumSettings.accentColor }}>Вход в систему</DialogTitle>
                      <DialogDescription>Войдите для создания тем и комментариев</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Логин</Label>
                        <Input 
                          value={loginForm.username}
                          onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                          placeholder="Введите логин"
                          className="bg-input border-border"
                        />
                      </div>
                      <div>
                        <Label>Пароль</Label>
                        <Input 
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          placeholder="Введите пароль"
                          className="bg-input border-border"
                        />
                      </div>
                      <Button onClick={handleLogin} className="w-full neon-border" style={{ backgroundColor: forumSettings.accentColor, color: '#0a0a0f' }}>
                        Войти
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-border neon-border-blue">
                      <Icon name="UserPlus" className="mr-2" size={18} />
                      Регистрация
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border neon-border-blue">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-secondary">Регистрация</DialogTitle>
                      <DialogDescription>Создайте аккаунт для участия в форуме</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Логин</Label>
                        <Input 
                          value={registerForm.username}
                          onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                          placeholder="Придумайте логин"
                          className="bg-input border-border"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input 
                          type="email"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                          placeholder="Введите email"
                          className="bg-input border-border"
                        />
                      </div>
                      <div>
                        <Label>Пароль</Label>
                        <Input 
                          type="password"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          placeholder="Придумайте пароль"
                          className="bg-input border-border"
                        />
                      </div>
                      <Button onClick={handleRegister} className="w-full neon-border-blue" style={{ backgroundColor: '#00d4ff', color: '#0a0a0f' }}>
                        Зарегистрироваться
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center neon-border" style={{ backgroundColor: forumSettings.accentColor + '20' }}>
                    <Icon name="User" size={20} style={{ color: forumSettings.accentColor }} />
                  </div>
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    {user.isAdmin && <Badge className="bg-accent text-accent-foreground">Admin</Badge>}
                  </div>
                </div>
                <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-border">
                      <Icon name="Settings" size={18} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border neon-border">
                    <DialogHeader>
                      <DialogTitle className="text-2xl" style={{ color: forumSettings.accentColor }}>Настройки профиля</DialogTitle>
                      <DialogDescription>Измените свой логин или пароль</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Новый логин</Label>
                        <Input 
                          value={settingsForm.newUsername}
                          onChange={(e) => setSettingsForm({ ...settingsForm, newUsername: e.target.value })}
                          placeholder={user.username}
                          className="bg-input border-border"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Оставьте пустым, чтобы не менять</p>
                      </div>
                      <div>
                        <Label>Новый пароль</Label>
                        <Input 
                          type="password"
                          value={settingsForm.newPassword}
                          onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
                          placeholder="Введите новый пароль"
                          className="bg-input border-border"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Оставьте пустым, чтобы не менять</p>
                      </div>
                      <div>
                        <Label>Подтвердите пароль</Label>
                        <Input 
                          type="password"
                          value={settingsForm.confirmPassword}
                          onChange={(e) => setSettingsForm({ ...settingsForm, confirmPassword: e.target.value })}
                          placeholder="Повторите новый пароль"
                          className="bg-input border-border"
                          disabled={!settingsForm.newPassword}
                        />
                      </div>
                      <Button onClick={handleUpdateProfile} className="w-full neon-border" style={{ backgroundColor: forumSettings.accentColor, color: '#0a0a0f' }}>
                        Сохранить изменения
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={() => {
                  setRegisteredUsers(registeredUsers.map(u => 
                    u.username === user.username 
                      ? { ...u, isOnline: false }
                      : u
                  ));
                  setUser(null);
                }} className="border-border">
                  <Icon name="LogOut" size={18} />
                </Button>
              </div>
            )}
          </div>
        </header>

        <Tabs defaultValue="forum" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="forum" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="MessageSquare" className="mr-2" size={18} />
              Форум
            </TabsTrigger>
            {user && (
              <TabsTrigger value="my-topics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Icon name="User" className="mr-2" size={18} />
                Мои темы
              </TabsTrigger>
            )}
            {user?.isAdmin && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Icon name="Settings" className="mr-2" size={18} />
                Админ-панель
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="forum" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Все темы</h2>
              {user && forumSettings.allowNewTopics && (
                <Dialog open={showNewTopicDialog} onOpenChange={setShowNewTopicDialog}>
                  <DialogTrigger asChild>
                    <Button className="neon-border" style={{ backgroundColor: forumSettings.accentColor, color: '#0a0a0f' }}>
                      <Icon name="Plus" className="mr-2" size={18} />
                      Создать тему
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border neon-border">
                    <DialogHeader>
                      <DialogTitle className="text-2xl" style={{ color: forumSettings.accentColor }}>Новая тема</DialogTitle>
                      <DialogDescription>Создайте новую тему для обсуждения</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Название темы</Label>
                        <Input 
                          value={newTopic.title}
                          onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                          placeholder="О чем хотите поговорить?"
                          className="bg-input border-border"
                        />
                      </div>
                      <div>
                        <Label>Содержание</Label>
                        <Textarea 
                          value={newTopic.content}
                          onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                          placeholder="Опишите тему подробнее..."
                          className="bg-input border-border min-h-[120px]"
                        />
                      </div>
                      <Button onClick={handleCreateTopic} className="w-full neon-border" style={{ backgroundColor: forumSettings.accentColor, color: '#0a0a0f' }}>
                        <Icon name="Send" className="mr-2" size={18} />
                        Создать
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="space-y-3">
              {sortedTopics.map((topic) => (
                <Card key={topic.id} className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:neon-border cursor-pointer" onClick={() => openTopicDialog(topic)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {topic.isPinned && (
                            <Badge className="bg-secondary text-secondary-foreground">
                              <Icon name="Pin" size={12} className="mr-1" />
                              Закреплено
                            </Badge>
                          )}
                          <Badge variant={topic.isOpen ? "default" : "secondary"} style={topic.isOpen ? { backgroundColor: forumSettings.accentColor, color: '#0a0a0f' } : {}}>
                            {topic.isOpen ? 'Открыта' : 'Закрыта'}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-1">{topic.title}</CardTitle>
                        <CardDescription>{topic.content}</CardDescription>
                      </div>
                      {user?.isAdmin && (
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="outline" onClick={() => togglePinTopic(topic.id)} className="border-border">
                            <Icon name={topic.isPinned ? "PinOff" : "Pin"} size={16} />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => toggleTopicStatus(topic.id)} className="border-border">
                            <Icon name={topic.isOpen ? "Lock" : "Unlock"} size={16} />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteTopic(topic.id)} className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Icon name="User" size={16} />
                        <span>{topic.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="MessageCircle" size={16} />
                        <span>{topic.replies} ответов</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Eye" size={16} />
                        <span>{topic.views} просмотров</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Calendar" size={16} />
                        <span>{topic.createdAt.toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {user && (
            <TabsContent value="my-topics" className="space-y-4">
              <h2 className="text-2xl font-bold">Мои темы</h2>
              <div className="space-y-3">
                {sortedTopics.filter(t => t.author === user.username).map((topic) => (
                  <Card key={topic.id} className="bg-card border-border hover:neon-border transition-all cursor-pointer" onClick={() => openTopicDialog(topic)}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={topic.isOpen ? "default" : "secondary"} style={topic.isOpen ? { backgroundColor: forumSettings.accentColor, color: '#0a0a0f' } : {}}>
                          {topic.isOpen ? 'Открыта' : 'Закрыта'}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{topic.title}</CardTitle>
                      <CardDescription>{topic.content}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Icon name="MessageCircle" size={16} />
                          <span>{topic.replies} ответов</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Eye" size={16} />
                          <span>{topic.views} просмотров</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {user?.isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <Card className="bg-card border-accent neon-border-pink">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Icon name="Settings" size={24} />
                    Настройки форума
                  </CardTitle>
                  <CardDescription>Управление внешним видом и функциями</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Акцентный цвет (неоновый)</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color"
                        value={forumSettings.accentColor}
                        onChange={(e) => setForumSettings({ ...forumSettings, accentColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input 
                        value={forumSettings.accentColor}
                        onChange={(e) => setForumSettings({ ...forumSettings, accentColor: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Разрешить создание тем</Label>
                      <p className="text-sm text-muted-foreground">Пользователи могут создавать новые темы</p>
                    </div>
                    <Switch 
                      checked={forumSettings.allowNewTopics}
                      onCheckedChange={(checked) => setForumSettings({ ...forumSettings, allowNewTopics: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Требовать авторизацию</Label>
                      <p className="text-sm text-muted-foreground">Только авторизованные пользователи могут писать</p>
                    </div>
                    <Switch 
                      checked={forumSettings.requireAuth}
                      onCheckedChange={(checked) => setForumSettings({ ...forumSettings, requireAuth: checked })}
                    />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h3 className="font-semibold mb-3">Статистика форума</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="bg-primary/10 border-primary/30">
                        <CardContent className="pt-6">
                          <div className="text-3xl font-bold" style={{ color: forumSettings.accentColor }}>{topics.length}</div>
                          <p className="text-sm text-muted-foreground">Всего тем</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-secondary/10 border-secondary/30">
                        <CardContent className="pt-6">
                          <div className="text-3xl font-bold text-secondary">{registeredUsers.length}</div>
                          <p className="text-sm text-muted-foreground">Пользователей</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-accent/10 border-accent/30">
                        <CardContent className="pt-6">
                          <div className="text-3xl font-bold text-accent">{comments.length}</div>
                          <p className="text-sm text-muted-foreground">Комментариев</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      <Dialog open={!!selectedTopic} onOpenChange={(open) => !open && setSelectedTopic(null)}>
        <DialogContent className="bg-card border-border neon-border max-w-4xl max-h-[80vh] flex flex-col">
          {selectedTopic && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  {selectedTopic.isPinned && (
                    <Badge className="bg-secondary text-secondary-foreground">
                      <Icon name="Pin" size={12} className="mr-1" />
                      Закреплено
                    </Badge>
                  )}
                  <Badge variant={selectedTopic.isOpen ? "default" : "secondary"} style={selectedTopic.isOpen ? { backgroundColor: forumSettings.accentColor, color: '#0a0a0f' } : {}}>
                    {selectedTopic.isOpen ? 'Открыта' : 'Закрыта'}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl" style={{ color: forumSettings.accentColor }}>{selectedTopic.title}</DialogTitle>
                <DialogDescription className="text-base">{selectedTopic.content}</DialogDescription>
                <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-2">
                    <Icon name="User" size={16} />
                    <span>{selectedTopic.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" size={16} />
                    <span>{selectedTopic.createdAt.toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              </DialogHeader>

              <Separator className="my-4" />

              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Комментарии ({topicComments.length})</h3>
                  
                  {topicComments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Пока нет комментариев</p>
                  ) : (
                    topicComments.map((comment) => (
                      <Card key={comment.id} className="bg-muted/30 border-border">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center neon-border" style={{ backgroundColor: forumSettings.accentColor + '20' }}>
                                <Icon name="User" size={16} style={{ color: forumSettings.accentColor }} />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{comment.author}</p>
                                <p className="text-xs text-muted-foreground">{comment.createdAt.toLocaleString('ru-RU')}</p>
                              </div>
                            </div>
                            {user?.isAdmin && (
                              <Button size="sm" variant="ghost" onClick={() => deleteComment(comment.id)} className="text-destructive hover:text-destructive">
                                <Icon name="Trash2" size={14} />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>

              {user && selectedTopic.isOpen && (
                <div className="pt-4 border-t border-border mt-4">
                  <div className="flex gap-2">
                    <Textarea 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Напишите комментарий..."
                      className="bg-input border-border min-h-[80px]"
                    />
                    <Button onClick={() => handleAddComment(selectedTopic.id)} className="neon-border self-end" style={{ backgroundColor: forumSettings.accentColor, color: '#0a0a0f' }}>
                      <Icon name="Send" size={18} />
                    </Button>
                  </div>
                </div>
              )}

              {!user && (
                <div className="pt-4 border-t border-border mt-4 text-center text-muted-foreground">
                  Войдите в аккаунт для добавления комментариев
                </div>
              )}

              {selectedTopic.isOpen === false && (
                <div className="pt-4 border-t border-border mt-4 text-center text-muted-foreground">
                  Тема закрыта для комментариев
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}