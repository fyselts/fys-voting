export type VotingSettings = {
    id: number
    title: string
    max_choices: number
    is_active: boolean
    is_published: boolean
}

export type VotingOption = {
    id: string
    name: string
    vote_count: number
    created_at: string
}

export type Voter = {
    user_id: string
    voted_at: string
}
