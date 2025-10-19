import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

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

export default function Index() {
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null);
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: 1,
      title: 'Правила форума Radmir RP',
      content: 'Добро пожаловать на форум Radmir RP! Здесь вы можете обсуждать игровые моменты...',
      author: 'Admin',
      replies: 45,
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
      replies: 23,
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
      replies: 89,
      views: 2341,
      isOpen: false,
      isPinned: true,
      createdAt: new Date('2025-10-10')
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

  const handleLogin = () => {
    if (!loginForm.username || !loginForm.password) {
      toast.error('Заполните все поля');
      return;
    }

    const isAdmin = loginForm.username.toLowerCase() === 'admin';
    setUser({ username: loginForm.username, isAdmin });
    toast.success(`Добро пожаловать, ${loginForm.username}!`);
    setLoginForm({ username: '', password: '' });
  };

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

  const pinnedTopics = topics.filter(t => t.isPinned).sort((a, b) => b.id - a.id);
  const regularTopics = topics.filter(t => !t.isPinned).sort((a, b) => b.id - a.id);
  const sortedTopics = [...pinnedTopics, ...regularTopics];

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-2 neon-glow" style={{ color: forumSettings.accentColor }}>
                RADMIR RP FORUM
              </h1>
              <p className="text-muted-foreground">Игровое сообщество | Обсуждения | Новости</p>
            </div>
            
            {!user ? (
              <Dialog>
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
                <Button variant="outline" onClick={() => setUser(null)} className="border-border">
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
                <Card key={topic.id} className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:neon-border">
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
                        <div className="flex gap-2">
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
                  <Card key={topic.id} className="bg-card border-border hover:neon-border transition-all">
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
                          <div className="text-3xl font-bold text-secondary">{topics.filter(t => t.isOpen).length}</div>
                          <p className="text-sm text-muted-foreground">Открытых тем</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-accent/10 border-accent/30">
                        <CardContent className="pt-6">
                          <div className="text-3xl font-bold text-accent">{topics.filter(t => t.isPinned).length}</div>
                          <p className="text-sm text-muted-foreground">Закрепленных</p>
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
    </div>
  );
}
