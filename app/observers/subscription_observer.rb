module SubscriptionObserver
  extend ActiveSupport::Concern

  included do

    # Calling state_machine method to transit from created -> processing
    after_create :start!



    # Method to call the SubscriptionWorker
    # Where we perform the payment method using MyMoip
    # I was going to try observers, but lets keep using concerns.
    #
    def process_subscription
      SubscriptionWorker.perform_async(id)
    end



    # 
    # State machine callbacks
    # All callbacks calls should be inside the state_machine block
    #
    state_machine do
      after_transition on: :start, do: :process_subscription 
    end


  end

end