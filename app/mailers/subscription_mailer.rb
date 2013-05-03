# coding: utf-8
class SubscriptionMailer < ActionMailer::Base
  default from:     "Alessandra do Meu Rio <alessandra@meurio.org.br>",
          bcc:      'financiador@meurio.org.br',
          reply_to: 'financiador@meurio.org.br',
          subject:  "Obrigada por financiar o Meu Rio!"

  default_url_options[:host] = 'apoie.meurio.org.br'
  
  def successful_create_message(subscription)
    defaults_for_subscription(subscription)
    mail(to: @subscriber.email)
  end


  def successful_create_message_for_bank_slip(subscription)
    defaults_for_subscription(subscription)
    mail(to: @subscriber.email)
  end


  def successful_create_message_for_249_to_500(subscription)
    defaults_for_subscription(subscription)
    mail(to: @subscriber.email)
  end

  def successful_create_message_for_500_to_1000(subscription)
    defaults_for_subscription(subscription)
    mail(to: @subscriber.email)
  end

  def autofire_for_0_249(subscription)
    defaults_for_subscription(subscription)
    mail(to: @subscriber.email)     
  end

  def autofire_for_249_500(subscription)
    defaults_for_subscription
    mail(to: @subscriber.email)
  end

  def inviter_friend_subscribed(subscription)
    defaults_for_invites(subscription)
    mail(to: @host.email, subject: 'Um amigo já colaborou através do seu link!')
  end


  def successful_invited_5_friends(subscription)
    defaults_for_invites(subscription)

    mail(to: @host.email, subject: 'Cinco amigos já colaboraram através do seu link!')
  end



  def defaults_for_invites(subscription)
    @host       = subscription.subscriber.invite.host
    @count      = @host.invitees.count
    @invite     = @host.invite.code
  end

  def defaults_for_subscription(subscription)
    @project      = Project.first.subscribers.size
    @subscription = subscription
    @subscriber   = @subscription.subscriber
    @code         = @subscription.code
    @invite       = @subscriber.invite.code if @subscriber.invite.present?
    
  end
end

